import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    console.log(`[API Proxy] Fetching URL: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Proxy] Error fetching from Google Docs: ${response.status}`, errorText.substring(0, 500));
      return res.status(response.status).send(`Error fetching from Google Docs: ${response.statusText}. Response: ${errorText}`);
    }

    const htmlText = await response.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    console.log(`[API Proxy] Successfully fetched and sending HTML for ${url}`);
    return res.status(200).send(htmlText);

  } catch (error: any) {
    console.error('[API Proxy] Internal server error:', error);
    return res.status(500).json({ error: 'Error proxying request', details: error.message });
  }
}