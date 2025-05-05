import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { getBackendUrl } from '@/utils/apiHelpers';

const ALLOWED_REGISTRATION_TYPES = ['contest', 'workshop', 'talkshow'];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { registrationType } = req.query;
     if (typeof registrationType !== 'string' || !ALLOWED_REGISTRATION_TYPES.includes(registrationType)) {
         return res.status(400).json({ message: 'Invalid registration type provided.' });
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ACCESS_TOKEN;

    if (!token) {
        console.warn(`[${registrationType}] submission attempt without auth token cookie.`);
        return res.status(401).json({ message: 'Authentication required.' });
    }
    console.log(req.body);
    
    const submissionData = req.body;

    const backendUrl = getBackendUrl(`/${registrationType}/submit`);
    console.log(`Forwarding POST submission to backend: ${backendUrl}`);

    try {
        const apiRes = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(submissionData)
        });

        console.log(`Backend [${registrationType}] submission response status: ${apiRes.status}`);

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
        console.error(`Error forwarding submission request for [${registrationType}] to backend:`, error);
        let errorMessage = 'An unknown error occurred while communicating with the backend.';
        if (error instanceof Error) { errorMessage = error.message; }
        res.status(500).json({ message: 'Failed to process submission', error: errorMessage });
    }
}