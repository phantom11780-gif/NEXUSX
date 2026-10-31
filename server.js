const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
res.json({
status: "ok",
name: "NOVA AI"
});
});

app.post("/api/chat", async (req, res) => {
try {
const prompt = String(req.body.prompt || "").trim();

if (!prompt) {
  return res.status(400).json({
    error: "لطفاً پیام خود را وارد کنید."
  });
}

if (!process.env.OPENAI_API_KEY) {
  return res.status(503).json({
    error: "کلید API هنوز تنظیم نشده است."
  });
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await client.responses.create({
  model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  instructions:
    "تو NOVA AI هستی؛ یک دستیار هوشمند، دقیق و دوستانه. اگر کاربر فارسی می‌نویسد، فارسی پاسخ بده.",
  input: prompt
});

res.json({
  reply: response.output_text || "پاسخی دریافت نشد."
});

} catch (error) {
console.error("NOVA AI error:", error.message);

res.status(500).json({
  error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید."
});

}
});

app.listen(PORT, "0.0.0.0", () => {
console.log("NOVA AI is running on port ${PORT}");
});