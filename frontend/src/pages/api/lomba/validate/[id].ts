import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, type } = req.query as { id: string; type: 'petra' | 'umum' }
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ADMIN_TOKEN;
    if (!token) {
        return res.status(401).json({ message: 'Authentication token not found.' });
    }
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/contest/validate/${id}`)
    try {
        const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contest/validate/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            valid: true, // Send only the status in the body
        }),
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