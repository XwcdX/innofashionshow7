import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie';

const ALLOWED_REGISTRATION_TYPES = ['contest', 'workshop', 'talkshow'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { registrationType } = req.query;
    if (typeof registrationType !== 'string' || !ALLOWED_REGISTRATION_TYPES.includes(registrationType)) {
        return res.status(400).json({ message: 'Invalid registration type provided.' });
    }
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ACCESS_TOKEN;
    if (!token) {
        return res.status(401).json({ message: 'Authentication token not found.' });
    }
    try {
        const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${registrationType}/getValidate`, {
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