const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
origin: process.env.FRONTEND_URL || "*"
}));

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
res.json({
name: "NOVA AI API",
status: "online",
version: "1.0.0"
});
});

app.get("/api/health", (req, res) => {
res.json({
success: true,
status: "healthy"
});
});

app.post("/api/chat", async (req, res) => {
try {
const prompt = String(req.body?.prompt || "").trim();

if (!prompt) {
  return res.status(400).json({
    success: false,
    error: "لطفاً یک پیام وارد کنید."
  });
}

if (prompt.length > 10000) {
  return res.status(413).json({
    success: false,
    error: "پیام بیش از حد طولانی است."
  });
}

if (!process.env.OPENAI_API_KEY) {
  return res.status(503).json({
    success: false,
    error: "کلید API تنظیم نشده است."
  });
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await client.responses.create({
  model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  instructions:
    "You are NOVA AI, a helpful multilingual AI assistant. Answer in the user's language. If the user writes in Persian, respond in Persian.",
  input: prompt
});

return res.json({
  success: true,
  reply: response.output_text || "پاسخی دریافت نشد."
});

} catch (error) {
console.error("NOVA API error:", error.message);

return res.status(500).json({
  success: false,
  error: "خطایی در سرور رخ داد."
});

}
});

app.listen(PORT, "0.0.0.0", () => {
console.log("NOVA AI API running on port ${PORT}");
});