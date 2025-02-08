import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/connection";
import logger from "./config/logger";
import llmRoutes from "./routes/llm.routes";
import { JWT_SECRET_KEY } from "./middlewares/auth";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "./utils/constants";

dotenv.config();
const app = express();

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
}

app.use(
  session({
    secret: JWT_SECRET_KEY,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(cookieParser());

// Middleware
app.use(express.json());

// cors
app.use(
  cors({
    credentials: true,
    origin: new URL(FRONTEND_URL!).origin,
  })
);

// Database connection
// connectDB();

// Routes
app.use("/api/llm", llmRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
