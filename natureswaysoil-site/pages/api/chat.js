import { NextResponse } from 'next/server';

/**
 * API route for handling chat messages.  Expects a JSON body with a
 * `messages` array following the OpenAI Chat API format.  Replies
 * with a JSON object containing a `reply` field.  Requires the
 * `OPENAI_API_KEY` environment variable to be set.  If no API key is
 * provided the endpoint returns a static response.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.json({ reply: 'Thanks for reaching out! We will get back to you soon.' });
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages.map(({ role, content }) => ({ role, content })),
        max_tokens: 150,
        temperature: 0.7
      })
    });
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ reply: reply || 'Sorry, I could not generate a response.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error communicating with AI' });
  }
}