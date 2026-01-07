import express from 'express';
import cors from "cors";
import authRouter from "./routes/authRoutes";
import logRouter from "./routes/logRoutes";
import salesRouter from "./routes/salesRoutes";
import expensesRouter from "./routes/expensesRoutes";
import { performHealthCheck } from "./helpers/healthCheckHelper";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get('/health', async (req, res) => {
  try {
    const healthStatus = await performHealthCheck();
    const statusCode = healthStatus.status === 'ok' ? 200 : 
                      healthStatus.status === 'degraded' ? 207 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/logs", logRouter);
app.use("/api/sales", salesRouter);
app.use("/api/expenses", expensesRouter);

export default app;
