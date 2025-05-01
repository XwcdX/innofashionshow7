
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#202021] py-12 px-4 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-6">
            <CompanyLogo src="/logo1.png" alt="Partner 1" />
            <CompanyLogo src="/logo2.png" alt="Partner 2" />
            <CompanyLogo src="/logo3.png" alt="Partner 3" />
          </div>
          
          <div className="text-center md:text-right">
            <h3 className="text-white text-xl font-bold mb-2">Contact Us</h3>
            <p className="text-gray-300">Sarah Johnson</p>
            <p className="text-gray-300">Event Manager</p>
            <p className="text-gray-300 mt-2">
              <a href="mailto:events@company.com" className="hover:text-[#a6ff4d] transition">
                events@company.com
              </a>
            </p>
            <p className="text-gray-300">
              <a href="tel:+18005551234" className="hover:text-[#a6ff4d] transition">
                +1 (800) 555-1234
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Event Horizons. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function CompanyLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-32 h-12">
      <Image 
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100px, 120px"
      />
    </div>
  );
}