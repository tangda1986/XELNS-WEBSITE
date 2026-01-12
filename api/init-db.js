import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(request, response) {
  if (typeof response.setHeader === 'function') {
    response.setHeader('Cache-Control', 'no-store, max-age=0');
  }

  const dataDir = path.join(process.cwd(), 'data');
  const dataFile = path.join(dataDir, 'site_data.json');

  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify({}, null, 2), 'utf-8');
    return response.status(200).json({ success: true });
  } catch (error) {
    return response.status(500).json({ success: false, error: error?.message || String(error) });
  }
}
