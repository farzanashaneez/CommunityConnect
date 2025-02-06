import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import { generateQRcode, getQRData } from "../services/api";
import { useAppSelector } from "../hooks/reduxStoreHook";

const generateUniqueToken = () => {
  return uuidv4();
};

const QRCodeGenerator:React.FC = () => {
  const [qrData, setQRData] = useState("");
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);

  const qrCodeRef = useRef<HTMLDivElement>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const userState = useAppSelector((state) => state.user);
  const id = userState.currentUser.user.id;

  useEffect(() => {
    fetchUserDataAndGenerateQR();
  }, []);
useEffect(()=>{
console.log('qrdata',qrData)
},[qrData])
  const fetchUserDataAndGenerateQR = async () => {
    try {
      const resp=await getQRData(id);
      if(resp){
        console.log("response ",resp)
        setQRData(`${import.meta.env.VITE_FRONTEND_URL}/security/verifyQRCode/${resp.token}`);
        // setExpiryTime(resp.expiry)
      }
else{
      const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      setExpiryTime(expiryDate);

      const uniqueToken = generateUniqueToken();
      await generateQRcode({
        userId: id,
        token: uniqueToken,
        expiry: expiryDate.toISOString(),
      });
      // setQRToken(uniqueToken)
      setQRData(`${import.meta.env.VITE_FRONTEND_URL}/security/verifyQRCode/${uniqueToken}`);
}

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const shareViaWhatsApp = async () => {
    if (qrCodeRef.current) {
      try {
        const canvas = await html2canvas(qrCodeRef.current);
        const imageData = canvas.toDataURL("image/png");

        // Create a blob from the image data
        const blob = await (await fetch(imageData)).blob();
        const file = new File([blob], "qrcode.png", { type: "image/png" });

        const shareData = {
          files: [file],
          title: "QR Code",
          text: `Here's my QR Code for verification. It expires on ${expiryTime?.toLocaleString()}`,
        };

        // Check if Web Share API is supported

        if (typeof navigator.canShare === "function" && isMobile) {
          await navigator.share(shareData);
        } else {
          alert(
            "Sharing is not supported on this browser. Please download the QR code and share manually."
          );
        }
      } catch (error) {
        console.error("Error sharing QR code:", error);
      }
    }
  };

  const downloadQRCode = async () => {
    if (qrCodeRef.current) {
      const canvas = await html2canvas(qrCodeRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "qrcode.png";
      link.click();
    }
  };

  return (
    <div>
      <h2>Your QR Code</h2>
      {qrData && (
        <div>
          <div ref={qrCodeRef}>
            <QRCode value={qrData} size={256} />
          </div>
          {typeof navigator.canShare === "function" && isMobile ? (
            <button
              onClick={shareViaWhatsApp}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#25D366",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Share via WhatsApp
            </button>
          ) : (
            <button
              onClick={downloadQRCode}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Download QR Code
            </button>
          )}
        </div>
      )}
      {expiryTime && (
        <p className="my-10">
          This QR code will expire on: {expiryTime.toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default QRCodeGenerator;
