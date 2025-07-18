
// import Image from 'next/image';

// export default function Footer() {
//   return (
//     <footer className="bg-[#202021] py-12 px-4 border-t border-gray-800">
//       <div className="container mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-8">
//           <div className="flex flex-wrap justify-center gap-6">
//             <CompanyLogo src="/logo1.png" alt="Partner 1" />
//             <CompanyLogo src="/logo2.png" alt="Partner 2" />
//             <CompanyLogo src="/logo3.png" alt="Partner 3" />
//           </div>
          
//           <div className="text-center md:text-right">
//             <h3 className="text-white text-xl font-bold mb-2">Contact Person</h3>
//             <p className="text-gray-300">Jecelyn Gozal</p>
//             <p className="text-gray-300">Ketua INNOFASHION SHOW 7</p>
//             <p className="text-gray-300 mt-2">
//               <a href="mailto:jecel@petra.id" className="hover:text-[#a6ff4d] transition">
//                 jecel@petra.id
//               </a>
//             </p>
//             <p className="text-gray-300">
//               <a href="tel:+18005551234" className="hover:text-[#a6ff4d] transition">
//                 +62 234-555-1234
//               </a>
//             </p>
//           </div>
//         </div>
        
//         <div className="mt-10 text-center text-gray-500 text-sm">
//           © {new Date().getFullYear()} INNOFASHION SHOW 7<br />
//           All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }

// function CompanyLogo({ src, alt }: { src: string; alt: string }) {
//   return (
//     <div className="relative w-32 h-12">
//       <Image 
//         src={src}
//         alt={alt}
//         fill
//         className="object-contain"
//         sizes="(max-width: 768px) 100px, 120px"
//       />
//     </div>
//   );
// }

// components/Footer.tsx
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-black text-white px-8 py-10">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <Image src="/assets/innologo.png" alt="INNOFASHION Logo" width={160} height={40} />

        {/* Social Media Icons */}
        <div className="flex gap-6 items-center">
          <a href="https://www.tiktok.com/@innofashionshow" aria-label="TikTok">
            <Image src="/assets/tiktoklogo.png" alt="TikTok" width={24} height={24} />
          </a>
          <a href="https://www.instagram.com/innofashion.pcu" aria-label="Instagram">
            <Image src="/assets/instalogo.png" alt="Instagram" width={24} height={24} />
          </a>
          <a href="https://line.me/R/ti/p/182dplyt" aria-label="Line">
            <Image src="/assets/linelogo.png" alt="Line" width={24} height={24} />
          </a>
          <a href="mailto:innofashionshow@gmail.com" aria-label="Email">
            <Image src="/assets/gmaillogo.png" alt="Email" width={28} height={20} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-[10px] text-gray-400 mt-4 tracking-wide">
        ©2025 INNOFASHION SHOW. 
        All Right Reserved
      </div>
    </footer>
  )
}
