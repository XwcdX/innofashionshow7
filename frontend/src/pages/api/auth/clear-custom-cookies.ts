import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const isProd = process.env.NODE_ENV === 'production';

  res.setHeader('Set-Cookie', serialize('ACCESS_TOKEN', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: -1,
  }));

  res.status(200).json({ message: 'ACCESS_TOKEN cookie cleared' });
}