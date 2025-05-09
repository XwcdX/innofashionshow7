import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

const ALLOWED_REGISTRATION_TYPES = ['contest', 'workshop', 'talkshow'];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { registrationType } = req.query;
    if (typeof registrationType !== 'string' || !ALLOWED_REGISTRATION_TYPES.includes(registrationType)) {
         return res.status(400).json({ message: 'Invalid registration type provided.' });
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ACCESS_TOKEN;

    if (!token) {
        console.warn(`Profile fetch attempt for [Creation] without auth token cookie.`);
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const backendUrl = getBackendUrl(`/contest/profileCreation`);
    console.log(`Forwarding GET to backend: ${backendUrl}`);

    try {
        const apiRes = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(`Backend [Creation] profile response status: ${apiRes.status}`);

        res.status(apiRes.status);
        apiRes.headers.forEach((v, k) => {
             if (k.toLowerCase() !== 'transfer-encoding' && k.toLowerCase() !== 'content-encoding') {
                res.setHeader(k, v);
             }
        });

        const contentType = apiRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
             try {
                 const data = await apiRes.json();
                 return res.json(data);
             } catch (e) {
                 const textData = await apiRes.text();
                 console.error(`Failed to parse JSON response (${apiRes.status}) from ${backendUrl}, returning text: ${textData}`);
                 return res.send(textData || `Backend error with status ${apiRes.status}`);
             }
        } else {
             const textData = await apiRes.text();
             return res.send(textData);
         }

    } catch (error) {
        console.error(`Error forwarding profile request for [Creation] to backend:`, error);
        let errorMessage = 'An unknown error occurred while communicating with the backend.';
        if (error instanceof Error) { errorMessage = error.message; }
        res.status(500).json({ message: 'Failed to fetch profile data', error: errorMessage });
    }
}

export const getBackendUrl = (path: string): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL environment variable is not set.");
    }
    return `${apiUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};