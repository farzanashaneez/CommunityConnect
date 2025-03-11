import Stripe from "stripe";
import express, { NextFunction, Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import BookingService from "../../application/services/BookingService";
import { Booking, Slot } from "../../domain/entities/hallbooking/HallBooking";
const router = express.Router();
interface CreateCheckoutRequest extends Request {
  body: {
    bookingData: Booking & { _id: string };
    slotData: Slot;
  };
}

router.post("/create-checkout-session", (req, res, next) => {
  (async (req: CreateCheckoutRequest, res: Response) => {
    const { bookingData, slotData } = req.body;

    try {
      // 2. Create temporary booking
      const booking = await BookingService.createBooking(
        { ...bookingData, status: "pending" },
        slotData
      );
      if (!booking || !booking._id) {
        throw new Error("booking not available");
      }
      // 3. Calculate amount in cents
      const amount = Math.round(slotData.slotPrice * 100);

      // 4. Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Hall Booking - ${slotData.title}`,
                description: `Time: ${slotData.start.toLocaleString()} - ${slotData.end.toLocaleString()}`,
                metadata: {
                  hallId: slotData.hallId,
                  slotType: slotData.slotType,
                },
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTENT_URL}/success?booking_id=${booking._id}`,
        cancel_url: `${process.env.FRONTENT_URL}/cancel?booking_id=${booking._id}`,
        metadata: {
          bookingId: booking?._id.toString(),
          userId: bookingData.userId,
          hallId: slotData.hallId.toString(),
          slotId: bookingData.selectedSlot?.toString() || "",
          purpose: bookingData.purpose,
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      });

      // 5. Update booking with session ID
      await BookingService.updateBooking(booking?._id, {
        stripeSessionId: session.id,
      });

      res.json({
        id: session.id,
        bookingId: booking._id,
      });
    } catch (error: any) {
      console.error("Stripe session creation error:", error);

      // Handle specific error cases
      if (error.type === "StripeCardError") {
        return res.status(400).json({
          error: "Payment failed. Please check your card details.",
        });
      }

      if (error.code === "BOOKING_CONFLICT") {
        return res.status(409).json({
          error: "This time slot is no longer available.",
        });
      }

      res.status(500).json({
        error: "Unable to process booking request.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  })(req, res).catch(next);
});

// Webhook handler for successful payments
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      try {
        // Update booking status
        if (bookingId)
          await BookingService.updateBooking(bookingId, {
            status: "confirmed",
            paid: session.amount_total ? session.amount_total / 100 : 0,
          });

      } catch (error) {
        console.error("Error updating booking:", error);
      }
    }

    res.json({ received: true });
  }
);

// Cleanup expired bookings and release slots
router.post("/cleanup-expired-bookings", async (req, res) => {
  try {
    const expiredBookings = await BookingService.findExpiredPendingBookings();

    for (const booking of expiredBookings) {
      // Update booking status
      if (booking?._id)
        await BookingService.updateBooking(booking?._id, {
          status: "cancelled",
        });

      // Release the slot
      if (typeof booking.selectedSlot === "string") {
        await BookingService.deleteExpiredSlot(booking.selectedSlot);
      }
    }

    res.json({ success: true, cleanedBookings: expiredBookings.length });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to cleanup expired bookings" });
  }
});

export default router;
