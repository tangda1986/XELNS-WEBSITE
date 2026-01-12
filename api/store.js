import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(request, response) {
  if (typeof response.setHeader === 'function') {
    response.setHeader('Cache-Control', 'no-store, max-age=0');
  }

  // Define path to data file
  // In Vercel, process.cwd() is the root of the project
  const dataDir = path.join(process.cwd(), 'data');
  const dataFile = path.join(dataDir, 'site_data.json');

  try {
    if (request.method === 'GET') {
      try {
        const content = await fs.readFile(dataFile, 'utf-8');
        const data = JSON.parse(content);
        return response.status(200).json(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          return response.status(200).json({});
        }
        throw error;
      }
    }

    if (request.method === 'POST') {
      // Ensure data directory exists
      try {
        await fs.access(dataDir);
      } catch {
        await fs.mkdir(dataDir, { recursive: true });
      }

      const body = request.body && typeof request.body === 'object' ? request.body : {};

      const allowKeys = new Set([
        'products',
        'productBanners',
        'solutionBanners',
        'aboutBanners',
        'serviceBanners',
        'contactBanners',
        'casesBanners',
        'companyInfo',
        'solutions',
        'services',
        'serviceDetails',
        'homePageData',
        'aboutData',
        'servicePageData',
        'customerCases'
      ]);

      const sanitized = {};
      for (const key of Object.keys(body)) {
        if (allowKeys.has(key)) sanitized[key] = body[key];
      }

      sanitized.__publishedId = new Date().toISOString();

      await fs.writeFile(dataFile, JSON.stringify(sanitized, null, 2), 'utf-8');
      
      return response.status(200).json({ success: true });
    }

    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Store Error:', error);
    return response.status(500).json({ error: error.message });
  }
}
