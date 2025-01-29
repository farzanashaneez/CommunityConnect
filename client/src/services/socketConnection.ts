import io from "socket.io-client";

export  const socket = io("http://192.168.0.101:5000", {
  path: "/socket.io",
   transports: ["websocket"], // Use WebSocket transport for better performance
});
