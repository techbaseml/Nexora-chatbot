# NEVORA

A ChatGPT-style AI chatbot with local chat history, responsive UI, voice input and a server-side AI endpoint.

## Deploy on Vercel

1. Import this project into Vercel.
2. In Vercel → Project Settings → Environment Variables, add:
   - `OPENAI_API_KEY` = your API key
   - `NEVORA_MODEL` = `gpt-5.6-luna` (or another model available to your API account)
3. Deploy.

The API key stays on the server; do not put it in `app.js` or `index.html`.

## Local

Run `vercel dev` after installing the Vercel CLI.
