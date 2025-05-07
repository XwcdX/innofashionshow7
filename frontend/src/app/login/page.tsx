'use client'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        // Main container: Full screen, overflow hidden, flex center
        <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-br from-[#0a001a] via-[#1a0033] to-[#26004d]">

            {/* --- Glitch Background Elements --- */}

            {/* Base overlay: adds depth (slightly darker) */}
            <div id="baseOverlay" className="absolute inset-0 z-[1] bg-black/70 pointer-events-none"></div>

            {/* Pixel sorting horizontal streak effect */}
            <div id="pixelSort" className="absolute inset-0 z-[5] pointer-events-none mix-blend-screen"></div>

            {/* Sharp geometric fragmentation - triangles */}
            <div id="fragmentation" className="absolute inset-0 z-[3] pointer-events-none">
                {/* Triangles with varied positions/delays */}
                <div className="triangle triangle1" style={{ top: '10%', left: '15%', animationDelay: '0s' }}></div>
                <div className="triangle triangle2" style={{ top: '42%', left: '35%', animationDelay: '1.5s' }}></div>
                <div className="triangle triangle3" style={{ top: '70%', left: '75%', animationDelay: '3s' }}></div>
                <div className="triangle triangle1" style={{ top: '55%', left: '60%', animationDelay: '4.5s' }}></div>
                <div className="triangle triangle2" style={{ top: '30%', left: '80%', animationDelay: '0.5s' }}></div>
                <div className="triangle triangle3" style={{ top: '85%', left: '25%', animationDelay: '2.5s' }}></div>
                <div className="triangle triangle1" style={{ top: '20%', left: '50%', animationDelay: '5s' }}></div>
                <div className="triangle triangle2" style={{ top: '65%', left: '10%', animationDelay: '1s' }}></div>
                <div className="triangle triangle3" style={{ top: '5%', left: '90%', animationDelay: '4s' }}></div>
                <div className="triangle triangle1" style={{ top: '78%', left: '48%', animationDelay: '2s' }}></div>
            </div>

            {/* Scan lines overlay */}
            <div id="scanLines" className="absolute inset-0 z-[8] pointer-events-none"></div>

            {/* Chromatic aberration effect wrapper */}
            <div id="chromaticAberration" className="absolute inset-0 z-[10] pointer-events-none"></div>

            {/* --- End Glitch Background Elements --- */}


            {/* --- Login Card (Larger & Responsive) --- */}
            <div className="relative z-20 flex flex-col items-center p-10 space-y-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl text-center max-w-lg w-[90%]"> {/* Increased max-w and padding */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg [text-shadow:_0_2px_4px_rgb(100_0_150_/_50%)]"> {/* Slightly darker text shadow */}
                    INNOFASHIONSHOW7
                </h1>

                <button
                    onClick={() => {
                        if (!isClient) return;
                        signIn('google', {
                            callbackUrl: '/auth/callback',
                            method: 'POST'
                        })
                    }}
                    disabled={!isClient}
                    className="flex items-center space-x-3 bg-white hover:bg-gray-200 border border-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {/* Google SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    <span>Login with Google</span>
                </button>
            </div>

            {/* Global styles needed for complex effects/animations */}
            <style jsx global>{`
                html, body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                /* Fragmentation Triangles Base Style */
                .triangle {
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    opacity: 0.1; /* Reduced base opacity */
                    filter: drop-shadow(0 0 3px rgba(122, 0, 176, 0.3)); /* Darker purple shadow, lower alpha */
                    animation: subtlePulse 7s ease-in-out infinite alternate;
                    user-select: none;
                }

                /* Triangle Variations (Darker Colors) */
                .triangle1 {
                    border-width: 45px 22px 0 22px;
                    border-color: #6a00a0 transparent transparent transparent; /* Darker purple */
                }
                .triangle2 {
                    border-width: 35px 18px 0 18px;
                    border-color: #9000c0 transparent transparent transparent; /* Darker magenta/purple */
                }
                .triangle3 {
                    border-width: 55px 28px 0 28px;
                    border-color: #7a00b0 transparent transparent transparent; /* Darker bright purple */
                }

                @keyframes subtlePulse {
                    0% {
                        opacity: 0.1;
                        filter: drop-shadow(0 0 3px rgba(122, 0, 176, 0.3));
                        transform: scale(1) rotate(0deg);
                    }
                    50% {
                        opacity: 0.25; /* Reduced max opacity */
                        filter: drop-shadow(0 0 6px rgba(196, 0, 196, 0.4)); /* Darker magenta shadow, lower alpha */
                        transform: scale(1.08) rotate(3deg);
                    }
                    100% {
                        opacity: 0.1;
                        filter: drop-shadow(0 0 3px rgba(122, 0, 176, 0.3));
                        transform: scale(1) rotate(0deg);
                    }
                }

                /* Scan lines overlay */
                #scanLines {
                    background:
                    repeating-linear-gradient(
                        0deg,
                        rgba(255,255,255,0.03) 0,
                        rgba(255,255,255,0.03) 1px,
                        transparent 1px,
                        transparent 3px
                    );
                    animation: flicker 4s infinite linear;
                }

                @keyframes flicker {
                    0% { opacity: 0.04; }
                    20% { opacity: 0.07; } /* Slightly reduced peaks */
                    40% { opacity: 0.03; }
                    60% { opacity: 0.08; } /* Slightly reduced peaks */
                    80% { opacity: 0.04; }
                    100% { opacity: 0.05; }
                }

                /* Pixel sorting horizontal streak effect (Darker colors, lower alpha) */
                #pixelSort {
                    background:
                    repeating-linear-gradient(
                        0deg,
                        rgba(122,0,176,0.08) 0, /* Darker purple, lower alpha */
                        rgba(122,0,176,0.08) 3px,
                        transparent 3px,
                        transparent 5px,
                        rgba(196,0,196,0.06) 5px, /* Darker magenta, lower alpha */
                        rgba(196,0,196,0.06) 8px,
                        transparent 8px,
                        transparent 11px
                    );
                    filter: blur(1px);
                    animation: pixelDrift 10s linear infinite alternate;
                }

                @keyframes pixelDrift {
                    0% {
                        background-position: 0 0;
                        transform: translateY(0);
                    }
                    50% {
                         transform: translateY(-2px);
                    }
                    100% {
                        background-position: 250px 0;
                         transform: translateY(0);
                    }
                }

                /* Chromatic aberration effect */
                #chromaticAberration {
                    filter: none;
                    animation: chromaShift 6s ease-in-out infinite alternate;
                }

                #chromaticAberration::before,
                #chromaticAberration::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: transparent;
                    pointer-events: none;
                }

                #chromaticAberration::before {
                    /* Darker magenta shift, reduced opacity */
                    filter: drop-shadow(1.5px 0 1px #c000c0); /* Darker magenta */
                    mix-blend-mode: screen;
                    clip-path: polygon(0 0, 55% 0, 65% 100%, 0% 100%);
                    transform: translateX(-1.8px);
                    opacity: 0.2; /* Reduced opacity */
                }

                #chromaticAberration::after {
                    /* Darker purple shift, reduced opacity */
                    filter: drop-shadow(-1.5px 0 1px #7a00b0); /* Darker purple */
                    mix-blend-mode: screen;
                    clip-path: polygon(45% 0, 100% 0, 100% 100%, 35% 100%);
                    transform: translateX(1.8px);
                    opacity: 0.25; /* Reduced opacity */
                }

                @keyframes chromaShift {
                    0%, 100% {
                        transform: translateX(0px) translateY(0px);
                    }
                    25% {
                        transform: translateX(-1px) translateY(0.5px);
                    }
                    50% {
                        transform: translateX(2px) translateY(-0.5px);
                    }
                     75% {
                        transform: translateX(-0.5px) translateY(-1px);
                    }
                }

            `}</style>
        </div>
    )
}