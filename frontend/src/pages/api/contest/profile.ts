import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ACCESS_TOKEN;

    if (!token) {
        console.warn('Profile fetch attempt without auth token cookie.');
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/profile`;
    console.log(`Forwarding GET to backend: ${backendUrl}`);

    try {
        const apiRes = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(`Backend profile response status: ${apiRes.status}`);

        res.status(apiRes.status);
        apiRes.headers.forEach((v, k) => {
             if (k.toLowerCase() !== 'transfer-encoding' && k.toLowerCase() !== 'content-encoding') {
                res.setHeader(k, v);
             }
        });

        const contentType = apiRes.headers.get('content-type');
        if (apiRes.ok && contentType && contentType.includes('application/json')) {
            const data = await apiRes.json();
            return res.json(data);
        } else if (!apiRes.ok) {
             try {
                const errorData = await apiRes.json();
                return res.json(errorData);
             } catch (e) {
                return res.send(await apiRes.text());
             }
        }
         else {
             return res.send(await apiRes.text());
         }

    } catch (error) {
        console.error("Error forwarding profile request to backend:", error);
        let errorMessage = 'An unknown error occurred while communicating with the backend.';
        if (error instanceof Error) { errorMessage = error.message; }
        res.status(500).json({ message: 'Failed to fetch profile data', error: errorMessage });
    }
}