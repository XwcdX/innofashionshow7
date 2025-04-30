import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    function handleChoose(category: 'INTERMEDIATE' | 'ADVANCED') {
        if (!isClient) return
        localStorage.setItem('category', category)
        signIn('google', { callbackUrl: '/auth/callback' })
    }

    return (
        <div className="buttons">
            <button
                className="btn intermediate"
                onClick={() => handleChoose('INTERMEDIATE')}
            >
                INTERMEDIATE
            </button>
            <button
                className="btn advanced"
                onClick={() => handleChoose('ADVANCED')}
            >
                ADVANCED
            </button>

            <style jsx>
            {`
            .buttons {
            display: flex;
            height: 100vh;
            }
            .btn {
            flex: 1;
            border: none;
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            }
            .intermediate {
            background: #4A5568; /* gray-700 */
            }
            .advanced {
            background: #2B6CB0; /* blue-700 */
            }
            /* On small screens, stack buttons */
            @media (max-width: 640px) {
            .buttons {
                flex-direction: column;
            }
            .btn {
                height: 50vh;
            }
            }
      `}
            </style>
        </div>
    )
}