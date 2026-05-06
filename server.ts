import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes would go here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock data for initial dashboard if needed
  app.get("/api/dashboard-stats", (req, res) => {
    res.json({
      revenueMtd: 128450,
      openInvoices: 12,
      pipelineLeads: 45,
      spendMtd: 24500,
      apOutstanding: 15600,
      lowStock: 8,
      openTickets: 5,
      expenses: 12400
    });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
