import express from "express";
import { getNews } from "../controllers/newsController.js";

const router = express.Router();

// GET /api/news?tickers=REL... or no tickers (defaults to all)
router.get("/", getNews);

export default router;
