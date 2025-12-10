// src/socket.js
import { io } from "socket.io-client";

// Vite environment variable (must start with VITE_)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, { autoConnect: true });
