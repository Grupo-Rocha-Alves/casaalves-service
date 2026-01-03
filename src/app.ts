import express from 'express';
import cors from "cors";
import authRouter from "./routes/authRoutes";
import logRouter from "./routes/logRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API está funcionando!' });
});

app.use("/api/auth", authRouter);
app.use("/api/logs", logRouter);

export default app;
