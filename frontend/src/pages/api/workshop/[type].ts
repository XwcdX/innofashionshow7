import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query as { type: 'petra' | 'umum' }
  try {
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workshops/${type}`, {
      headers: {
        cookie: req.headers.cookie || ''
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