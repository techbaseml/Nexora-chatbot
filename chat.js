export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is missing in Vercel Environment Variables."
      });
    }

    const model = process.env.NEVORA_MODEL || "gpt-5";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        instructions:
          "You are NEVORA, a helpful AI assistant. Answer clearly and naturally. Follow the user's language. If the user writes Malayalam, respond in Malayalam. If the user writes English, respond in English.",
        input: messages.map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content
        }))
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI API request failed."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "NEVORA could not generate a response."
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error."
    });
  }
}
