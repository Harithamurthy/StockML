import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import newsRouter from "./routes/newsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/news", newsRouter);

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend running" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});
