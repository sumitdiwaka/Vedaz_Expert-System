import { io } from "socket.io-client";

// Use VITE_SOCKET_URL from .env, fallback to localhost for development
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling']
});