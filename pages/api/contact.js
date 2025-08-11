import prisma from '../../lib/prisma';

/**
 * API route for contact form submissions.  Accepts POST requests
 * containing a JSON payload with `name`, `email` and `message`.
 * Stores the submission in the database and returns a success
 * response.  If any field is missing a 400 response is returned.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    await prisma.contact.create({
      data: { name, email, message }
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save message' });
  }
}