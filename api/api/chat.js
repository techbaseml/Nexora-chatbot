import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured",
      });
    }

    const { message, input, history } = req.body || {};
    const userMessage = message || input;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const messages = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string"
          )
          .slice(-20)
      : [];

    messages.push({
      role: "user",
      content: userMessage,
    });

    const response = await client.responses.create({
      model: "gpt-5.5",
      instructions:
        "You are NEVORA, a helpful AI assistant. Answer clearly, naturally and accurately.",
      input: messages,
    });

    return res.status(200).json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("NEVORA API error:", error);

    return res.status(500).json({
      error: error?.message || "AI server error",
    });
  }
}
