import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Backend imports
import apiRoutes from "./backend/src/routes/index.js";
import { errorMiddleware } from "./backend/src/middleware/error.middleware.js";
import prisma from "./backend/src/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // GLOBAL LOGGER
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Verify and log DB connection with retries
  const maxRetries = 5;
  let currentRetry = 0;
  let connected = false;

  while (currentRetry < maxRetries && !connected) {
    try {
      await prisma.$connect();
      console.log("✅ Database connected successfully");
      connected = true;
    } catch (err: any) {
      currentRetry++;
      console.error(`❌ Database connection failed (attempt ${currentRetry}/${maxRetries}):`, err.message || err);
      if (currentRetry < maxRetries) {
        console.log(`Retrying in ${currentRetry * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, currentRetry * 2000));
      }
    }
  }

  if (!connected) {
    console.error("⛔ Could not connect to database after multiple attempts. Application may be unstable.");
  }

  // Standard Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for Vite dev mode compatibility
  }));
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  console.log('API Router Status:', typeof apiRoutes === 'function' ? 'Valid' : 'Invalid (' + typeof apiRoutes + ')');
  
  app.use("/api", (req, res, next) => {
    console.log(`[${new Date().toISOString()}] API Request: ${req.method} ${req.url}`);
    next();
  }, apiRoutes);

  // Debug route
  app.get("/api/debug-ping", (req, res) => {
    res.json({ message: "pong", timestamp: new Date().toISOString() });
  });

  // Specific 404 for API routes to prevent HTML fallback
  app.use("/api/*", (req, res) => {
    console.log(`Unmatched API: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      success: false,
      message: `API route not found: ${req.originalUrl}`,
      error: "NotFound"
    });
  });

  // Health check (root)
  app.get("/api/health-check", (req, res) => {
    console.log("Health check hit");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error Handling (Must be after all routes)
  app.use(errorMiddleware);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
