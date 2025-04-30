import { useEffect, useState } from 'react'

export default function Dashboard() {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN')
        if (!token) {
            setError('Not authenticated')
            return
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(setData)
            .catch(() => setError('Fetch failed'))
    }, [])

    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!data) return <p>Loading your profile…</p>
    return <pre>{JSON.stringify(data, null, 2)}</pre>
}