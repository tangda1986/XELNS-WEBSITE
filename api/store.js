import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (typeof response.setHeader === 'function') {
    response.setHeader('Cache-Control', 'no-store, max-age=0');
  }

  if (request.method === 'GET') {
    try {
      const { rows } = await sql`SELECT key, value FROM site_data`;
      const data = {};
      rows.forEach(row => {
        data[row.key] = row.value;
      });
      return response.status(200).json(data);
    } catch (error) {
      console.error('API Store Error:', error);
      // Table might not exist yet
      if (error.message.includes('relation "site_data" does not exist')) {
        return response.status(200).json({});
      }
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === 'POST') {
    try {
      const data = request.body && typeof request.body === 'object' ? request.body : {};
      const keys = Object.keys(data);

      await sql`
        CREATE TABLE IF NOT EXISTS site_data (
          key TEXT PRIMARY KEY,
          value JSONB,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      for (const key of keys) {
        const value = data[key];
        const valueJson = JSON.stringify(value);
        await sql`
          INSERT INTO site_data (key, value, updated_at)
          VALUES (${key}, ${valueJson}::jsonb, CURRENT_TIMESTAMP)
          ON CONFLICT (key) 
          DO UPDATE SET value = ${valueJson}::jsonb, updated_at = CURRENT_TIMESTAMP;
        `;
      }
      
      return response.status(200).json({ success: true });
    } catch (error) {
      console.error('API Store POST Error:', error);
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
