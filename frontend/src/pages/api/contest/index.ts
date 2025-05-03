import type { NextApiRequest, NextApiResponse } from 'next'

export const config = { api: { bodyParser: false } }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    const forwardRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/submit`, {
        method: 'POST',
        headers: {
            'content-type': req.headers['content-type']!,
            cookie: req.headers.cookie || ''
        },
        body: req.body as any,
    })

    res.status(forwardRes.status)
    forwardRes.headers.forEach((v, k) => res.setHeader(k, v))

    const buf = Buffer.from(await forwardRes.arrayBuffer())
    return res.send(buf)
}
