import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_data (
        key TEXT PRIMARY KEY,
        value JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return response.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
