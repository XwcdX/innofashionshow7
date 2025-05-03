import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { email, name } = req.body

    const apiRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
    })

    if (!apiRes.ok) {
        const err = await apiRes.json().catch(() => ({}))
        return res
            .status(apiRes.status)
            .json({ message: err.message || apiRes.statusText })
    }

    const { token } = await apiRes.json()

    const isProd = process.env.NODE_ENV === 'production'
    res.setHeader('Set-Cookie', serialize('ACCESS_TOKEN', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 1,
    }))

    res.status(200).json({ ok: true })
}
