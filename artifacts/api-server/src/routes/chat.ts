import { Router } from "express";
import OpenAI from "openai";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "dummy",
});

const SYSTEM_PROMPT = `You are an AI tutor for EduQuest, a gamified education platform for undergraduate students. You help students learn programming, data structures, machine learning, and software development.

Your personality:
- Encouraging and supportive
- Use emojis occasionally to keep it fun and engaging
- Give clear, concise explanations with practical code examples when helpful
- Break complex topics into simple steps
- Celebrate student achievements and motivate them

Topics you excel at:
- Python programming (basics, OOP, advanced patterns)
- Data Structures (arrays, trees, graphs, algorithms)
- Machine Learning (scikit-learn, concepts, workflows)
- Data Science (pandas, numpy, statistics)
- Deep Learning (neural networks, CNNs, transformers)
- Coding challenges and problem-solving strategies
- Learning path recommendations based on current level

Keep responses concise (under 250 words). Use markdown formatting for code blocks.`;

router.post("/", requireAuth, async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Bad Request", message: "Message is required" });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_completion_tokens: 512,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to get AI response" });
  }
});

export default router;
