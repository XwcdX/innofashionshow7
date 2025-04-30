import { useState } from 'react';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const res = await fetch(`${API_URL}/admin/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            const body = await res.json();
            setError(body.message || 'Admin login failed');
            return;
        }

        const { token, admin } = await res.json();
        localStorage.setItem('ADMIN_TOKEN', token);
        router.push('/admin/dashboard');
    }

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <br /><br />
                <button type="submit">Log in as Admin</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
