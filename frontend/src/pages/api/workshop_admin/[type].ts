import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query as { type: 'petra' | 'umum' }
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.ADMIN_TOKEN;
  if (!token) {
      return res.status(401).json({ message: 'Authentication token not found.' });
  }
  try {
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workshop/${type}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ message: await apiRes.text() })
    }
    const data = await apiRes.json()
    return res.status(200).json(data)
  } catch (e: any) {
    console.error(e)
    return res.status(500).json({ message: e.message })
  }
}