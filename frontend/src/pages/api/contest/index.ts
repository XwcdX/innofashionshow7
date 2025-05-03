import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ACCESS_TOKEN;

    if (!token) {
        console.warn('Contest submission attempt without auth token cookie.');
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const submissionData = req.body;

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/submit`;
    console.log(`Forwarding POST to backend: ${backendUrl}`);

    try {
        const apiRes = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(submissionData)
        });

        console.log(`Backend response status: ${apiRes.status}`);

        res.status(apiRes.status);
        apiRes.headers.forEach((v, k) => {
            if (k.toLowerCase() !== 'transfer-encoding' && k.toLowerCase() !== 'content-encoding') {
                res.setHeader(k, v);
            }
        });

        const contentType = apiRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await apiRes.json();
            return res.json(data);
        } else {
            const textData = await apiRes.text();
            return res.send(textData);
        }

    } catch (error) {
        console.error("Error forwarding submission request to backend:", error);
        let errorMessage = 'An unknown error occurred while communicating with the backend.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(500).json({ message: 'Failed to process submission', error: errorMessage });
    }
}
