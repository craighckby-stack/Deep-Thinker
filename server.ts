import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

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

  // Health and Diagnostic endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", service: "DEEP_THINKER_API", timestamp: Date.now() });
  });

  app.get("/api/system/scaffold", (req, res) => {
    res.json({
      status: "online",
      service: "SYSTEM_SCAFFOLD_API",
      model: "gemini-3.6-flash",
      capabilities: ["high_thinking", "telemetry_tracking", "epistemic_reasoning"],
      timestamp: Date.now(),
    });
  });

  app.post("/api/chat", async (req, res) => {
    const startTime = Date.now();
    try {
      const { messages, thinkingLevel = "high" } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const formattedContents = messages.map((msg: { role: string; text: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      let response;
      let modelUsed = "gemini-3.6-flash";
      const thinkingConfig = thinkingLevel === "off"
        ? undefined
        : { thinkingLevel: thinkingLevel === "low" ? ThinkingLevel.LOW : ThinkingLevel.HIGH };

      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: formattedContents,
          ...(thinkingConfig ? { config: { thinkingConfig } } : {}),
        });
      } catch (err: any) {
        if (
          err?.status === 429 ||
          err?.message?.includes("RESOURCE_EXHAUSTED") ||
          err?.message?.includes("Quota exceeded")
        ) {
          console.warn("Retrying with gemini-flash-latest due to rate/quota limits on gemini-3.6-flash...");
          modelUsed = "gemini-flash-latest";
          response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: formattedContents,
          });
        } else {
          throw err;
        }
      }

      const latencyMs = Date.now() - startTime;

      res.json({
        text: response.text,
        latencyMs,
        modelUsed,
        telemetry: {
          timestamp: Date.now(),
          thinkingLevel,
          version: "1.0.0-DEEP-THINKER",
        },
      });
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
