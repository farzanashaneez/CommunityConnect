import mongoose, { Schema } from "mongoose";
import { Booking, Slot } from "../../domain/entities/hallbooking/HallBooking";
import { BookingRepository } from "../../application/interfaces/BookRepository";

const slotSchema = new Schema<Slot>({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  slotType: {
    type: String,
    enum: ["HD-morning", "HD-evening", "Fullday"],
    required: true,
  },
  slotPrice: { type: Number },
  status: {
    type: String,
    enum: ["available", "booked", "cancelled", "notavailable"],
    default: "available",
  },
  hallId: {
    type: Schema.Types.ObjectId,
    ref: "Hall",
    required: true,
  },
});

const SlotModel = mongoose.model<Slot>("Slot", slotSchema);

const bookingSchema = new Schema<Booking>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  otherServiceAdded: { type: Boolean, default: true },
  selectedSlot: { type: Schema.Types.ObjectId, ref: "Slot" },
  purpose: { type: String },
  totalPrice: { type: Number, required: true },
  paid: { type: Number, required: true },
  stripeSessionId: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"] },
  createdAt: { type: Date, default: Date.now },
});

const BookingModel = mongoose.model<Booking>("Booking", bookingSchema);

export class MongoBookingRepository implements BookingRepository {
  async createBooking(booking: Booking, slot: Slot): Promise<Booking> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newSlot = new SlotModel({ ...slot });
      const slotCreated = await newSlot.save({ session });
      if (slotCreated) {
        const newBooking = new BookingModel({
          ...booking,
          selectedSlot: slotCreated._id,
        });
        const savedBooking = await newBooking.save({ session });

        await session.commitTransaction();
        session.endSession();

        return savedBooking;
      } else {
        throw new Error("Failed to create slot");
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async findById(id: string): Promise<Booking | null> {
    return BookingModel.findById(id).exec();
  }

  async findByExpired(): Promise<Booking[]> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    return BookingModel.find({
      status: "pending",
      createdAt: { $lt: thirtyMinutesAgo },
    }).exec();
  }

  async update(
    id: string,
    bookingData: Partial<Booking>
  ): Promise<Booking | null> {
    if (bookingData.status === "confirmed") {
      const existingBooking = await BookingModel.findById(id);

      if (existingBooking) {
        bookingData.paid = existingBooking.totalPrice;
      }
    }

    return BookingModel.findByIdAndUpdate(id, bookingData, {
      new: true,
    }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await BookingModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findAll(): Promise<Booking[]> {
    return BookingModel.find()
      .populate("selectedSlot")
      .populate("userId")
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return BookingModel.find({ userId })

      .populate({
        path: "selectedSlot",
        populate: {
          path: "hallId",
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteSlot(id: string): Promise<boolean> {
    const result = await SlotModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async updateSlot(id: string, slotData: Partial<Slot>): Promise<Slot | null> {
    if (slotData.status === "cancelled") return this.updateSlotAndBooking(id);
    else return SlotModel.findByIdAndUpdate(id, slotData, { new: true }).exec();
  }

  async updateSlotAndBooking(slotId: string): Promise<Slot | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedSlot = await SlotModel.findByIdAndUpdate(
        slotId,
        { status: "cancelled" },
        { new: true, session }
      ).exec();

      await BookingModel.findOneAndUpdate(
        { selectedSlot: slotId },
        { status: "cancelled" },
        { new: true, session }
      ).exec();

      await session.commitTransaction();
      // return { slot: updatedSlot, booking: updatedBooking };
      return updatedSlot;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAvailableSlots(
    startDate: Date,
    endDate: Date,
    hallid: string
  ): Promise<Slot[]> {
    return SlotModel.find({
      status: { $in: ["booked", "notavailable"] },
      start: { $gte: startDate },
      end: { $lte: endDate },
      hallId: new mongoose.Types.ObjectId(hallid),
    });
  }

  async getAllSlots(hallid: string): Promise<Slot[]> {
    return SlotModel.find({
      // status: { $in: ['booked', 'notavailable'] },

      hallId: new mongoose.Types.ObjectId(hallid),
    });
  }
}
