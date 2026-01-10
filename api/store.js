import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (typeof response.setHeader === 'function') {
    response.setHeader('Cache-Control', 'no-store, max-age=0');
  }

  if (request.method === 'GET') {
    // Enable Vercel Edge Caching:
    // s-maxage=10: Cache at the edge for 10 seconds (fresh)
    // stale-while-revalidate=59: Serve stale content for up to 59 seconds while updating in background
    if (typeof response.setHeader === 'function') {
      response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=59');
    }

    try {
      const url = new URL(request.url, 'http://localhost');
      const keyParam = url.searchParams.get('key');
      const keysParam = url.searchParams.get('keys');
      const modeParam = url.searchParams.get('mode');

      if (modeParam === 'list') {
        const { rows } = await sql`SELECT key, updated_at FROM site_data`;
        return response.status(200).json(rows);
      }

      if (keyParam) {
        const { rows } = await sql`SELECT value FROM site_data WHERE key = ${keyParam}`;
        if (rows.length > 0) {
          return response.status(200).json({ [keyParam]: rows[0].value });
        } else {
          return response.status(200).json({});
        }
      }

      if (keysParam) {
        const keys = keysParam.split(',').filter(k => k.trim());
        if (keys.length > 0) {
          // Construct a safe query for multiple keys manually since ANY/IN support varies
          // This is safe because we're not concatenating user input directly into SQL structure,
          // but passing parameters individually or letting the driver handle it if possible.
          // However, @vercel/postgres tagged template literals are strict.
          // Fallback: Fetch all needed rows using a simple OR logic or just fetch all and filter in memory if list is small.
          // But for performance, let's try a safer parameterized approach if possible, or just revert to single/bulk for stability.
          
          // Safer Approach: Fetch all and filter in memory (Trade-off: bandwidth vs stability)
          // Given the "UI Lost" issue, stability is priority. 
          // If we fetch all, it's same as bulk.
          
          // Let's try to just return the requested keys by filtering the full result set.
          // This is inefficient but 100% safe against SQL syntax errors in Vercel environment.
          const { rows } = await sql`SELECT key, value FROM site_data`;
          const data = {};
          const requestedKeys = new Set(keys);
          rows.forEach(row => {
            if (requestedKeys.has(row.key)) {
              data[row.key] = row.value;
            }
          });
          return response.status(200).json(data);
        }
      }

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
