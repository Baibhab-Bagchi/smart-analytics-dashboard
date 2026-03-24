import express from "express";
import OpenAI from "openai";

const router = express.Router();

router.post("/", async (req, res) => {
  const { revenue, message } = req.body;

  if (!message) return res.status(400).json({ error: "No message provided" });

  // fallback reply
  let reply = `Test fallback reply for: "${message}" with revenue ₹${revenue ?? 0}`;

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠️ OpenAI API key missing. Returning fallback.");
      return res.json({ reply });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Use chat model
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // works for everyone
      messages: [
        {
          role: "user",
          content: `Analyze this revenue data and give insights: Revenue = ₹${revenue ?? 0}. ${message}`,
        },
      ],
    });

    reply = response.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "AI request failed", reply });
  }
});

export default router;