import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
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
      const data = request.body;
      const keys = Object.keys(data);
      
      // Use a transaction or batch insert could be better, but simple loop is fine for low volume
      for (const key of keys) {
        const value = data[key];
        await sql`
          INSERT INTO site_data (key, value, updated_at)
          VALUES (${key}, ${value}, CURRENT_TIMESTAMP)
          ON CONFLICT (key) 
          DO UPDATE SET value = ${value}, updated_at = CURRENT_TIMESTAMP;
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
