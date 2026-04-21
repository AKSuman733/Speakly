import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import express from "express";
import { setupWebSocket } from "./websocket/socket.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);

// optional HTTP route
app.get("/", (req, res) => {
  res.send("Server running");
});

const server = http.createServer(app);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  setupWebSocket(server);
  console.log("Server running on http://localhost:5000");
});