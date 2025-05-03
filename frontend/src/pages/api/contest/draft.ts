import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function draftHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end();
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ACCESS_TOKEN;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token not found.' });
    }

    const draft = req.body;
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/draft`;
    console.log(`Fetching POST to backend: ${backendUrl}`);

    try {
        const apiRes = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(draft)
        });

        console.log(`Backend response status: ${apiRes.status}`);

        if (!apiRes.ok) {
            try {
                const errorData = await apiRes.json();
                return res.status(apiRes.status).json(errorData);
            } catch (e) {
                const text = await apiRes.text();
                return res.status(apiRes.status).send(text);
            }
        }

        const data = await apiRes.json();
        res.status(apiRes.status).json(data);


    } catch (error) {
        console.error("Error fetching from backend:", error);
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(500).json({ message: 'Failed to fetch from backend', error: errorMessage });
    }
}