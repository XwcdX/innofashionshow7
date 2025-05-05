import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { getBackendUrl } from '@/utils/apiHelpers';

const ALLOWED_REGISTRATION_TYPES = ['contest', 'workshop', 'talkshow'];

export default async function draftHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { registrationType } = req.query;
    if (typeof registrationType !== 'string' || !ALLOWED_REGISTRATION_TYPES.includes(registrationType)) {
        return res.status(400).json({ message: 'Invalid registration type provided.' });
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.ACCESS_TOKEN;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token not found.' });
    }

    const draft = req.body;
    const backendUrl = getBackendUrl(`/${registrationType}/draft`);
    console.log(`Forwarding POST draft to backend: ${backendUrl}`);

    try {
        const apiRes = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(draft)
        });

        console.log(`Backend [${registrationType}] draft response status: ${apiRes.status}`);

        res.status(apiRes.status);
        const contentType = apiRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await apiRes.json();
            return res.json(data);
        } else {
            const textData = await apiRes.text();
            if (apiRes.ok && !textData) {
                return res.end();
            }
            return res.send(textData);
        }

    } catch (error) {
        console.error(`Error forwarding draft request for [${registrationType}] to backend:`, error);
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) { errorMessage = error.message; }
        res.status(500).json({ message: 'Failed to save draft via backend', error: errorMessage });
    }
}