'use client';

interface BackButtonProps {
  text?: string;
  href: string;
}

export default function BackButton({ text = '← Back', href }: BackButtonProps) {
  return (
    <a
      href={href}
      className="fixed top-4 left-4 z-50 px-4 py-2 rounded-full backdrop-blur-md bg-white/20 text-white border border-white/30 shadow-md hover:bg-white/30 transition"
    >
      {text}
    </a>
  );
}
