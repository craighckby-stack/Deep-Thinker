import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Format messages for multi-turn if needed, or simply pass the last message.
      // We will create a chat session on the fly, or just pass the full contents.
      const chat = ai.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        },
      });

      // To simplify, we'll just send the last message for this example,
      // or we can recreate the history. Let's just use generateContent for single-turn 
      // or map messages to contents. We will map all previous messages as contents.
      const formattedContents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: formattedContents,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
