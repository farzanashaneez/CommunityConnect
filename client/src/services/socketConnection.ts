import io from "socket.io-client";

export  const socket = io(`${import.meta.env.VITE_API_URL}`, {
  path: "/socket.io",
   transports: ["websocket"], // Use WebSocket transport for better performance
});
