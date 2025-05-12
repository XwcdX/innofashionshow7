'use client';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement> & { className?: string }) => ( // Added className to props
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        <path d="M1 1h22v22H1z" fill="none" />
    </svg>
);


export default function LoginPage() {
    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleGoogleSignIn = () => {
        const next = searchParams?.get('next') || '/registration';
        if (!isClient) return;
        signIn('google', {
            callbackUrl: `/auth/callback?next=${encodeURIComponent(next)}`,
        });
    };

    const innofashionLogoPath = "/assets/innologo.png";

    return (
        <>
            <div className="main-layout-background flex items-center justify-center w-screen h-screen overflow-hidden font-neue-montreal">
                <div className="flex items-center justify-center w-full h-full p-4">
                    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-8 md:p-10 rounded-2xl md:rounded-3xl bg-black/20 backdrop-blur-xl shadow-2xl shadow-purple-900/30 border border-white/20 flex flex-col justify-center items-center text-center space-y-8 md:space-y-10">
                        <div className="image-innofashionshow">
                            <Image
                                src={innofashionLogoPath}
                                alt="Innofashionshow Logo"
                                width={200}
                                height={60}
                                className="w-[160px] md:w-[200px] h-auto"
                                priority
                            />
                        </div>

                        <div className="button-container relative w-full max-w-[280px] md:max-w-[320px] h-[40px] md:h-[48px] rounded-full group transform"> {/* Removed translate-y for now, can be added if preferred */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={!isClient}
                                className="w-full h-full flex items-center justify-center text-[12px] md:text-sm font-eirene font-semibold text-white bg-white/5 hover:bg-white/10 border-2 border-white/30 hover:border-white/50 rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-lg hover:shadow-purple-500/20 active:bg-white/15 active:shadow-inner disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                            >
                                <GoogleIcon className="w-5 h-5 md:w-6 md:h-6 mr-3 flex-shrink-0" />
                                <span className="truncate">Sign In with Google</span>
                            </button>
                            <p className="w-full mt-2 text-sm italic text-white/70 text-start">
                                *Note: For internal use <b>Petra</b> email only
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                /* @font-face rules should be in globals.css and within @layer base */
                /* For brevity, I'm assuming they are loaded via globals.css */

                /* html {
                  scroll-behavior: auto !important;
                  font-family: theme('fontFamily.neue-montreal'); // Example of setting global default via theme
                }
                body {
                  margin: 0;
                  padding: 0;
                } */
                /* The body and html styles from @font-face section in globals.css cover these */

                .main-layout-background {
                  background: linear-gradient(
                    135deg,
                    #A30A99 0%,
                    #820D8C 25%,
                    #5F117F 50%,
                    #3D1472 75%,
                    #281660 100%
                  );
                  background-attachment: fixed;
                  background-size: 200% 200%;
                  animation: gradientAnimation 15s ease infinite;
                }
                @keyframes gradientAnimation {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                
                /* These fallbacks are only needed if aliceblue is NOT in tailwind.config.js */
                /* .border-aliceblue-default { border-color: aliceblue; } 
                   .text-aliceblue-default { color: aliceblue; }
                   .active\\:bg-aliceblue-default\\/20:active { background-color: rgba(240, 248, 255, 0.2); } */
            `}</style>
        </>
    );
}