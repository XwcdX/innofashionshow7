// export default function ThemeSection() {
//     return (
//       <section className="min-h-screen bg-black text-neon flex flex-col justify-center items-center p-8">
//         {/* Moderniz font for headline */}
//         <h1 className="font-moderniz text-6xl font-bold mb-4 tracking-tighter">
//           ILLUMINÉ
//         </h1>
        
//         {/* Eirene Sans for body */}
//         <p className="font-eirene text-cyan text-xl mb-8">
//           A French-inspired take on illuminate for a high-fashion feel.
//         </p>
  
//             {/* Colorful keywords
//             <div className="flex gap-6">
//             <span className="text-neon">Modern</span>
//             <span className="text-pink">Elegant</span>
//             <span className="text-cyan">Futuristic</span>
//             <span className="text-purple">Glitching</span>
//             </div> */}
//       </section>
//     )
//   }


export default function ThemeSection() {
    return (
      
      <div className="bg-[#202021] min-h-screen p-8 flex flex-col justify-center items-center">
        {/* Forced color example */}
        <h1 
          className="text-[#a6ff4d] font-bold text-6xl mb-4"
          style={{ fontFamily: "Moderniz, sans-serif" }}
        >
          ILLUMINÉ
        </h1>
        
        <p 
          className="text-[#8f03d1] text-xl mb-8"
          style={{ fontFamily: "Eirene Sans, sans-serif" }}
        >
          A French-inspired take on illuminate for a high-fashion feel.
        </p>
  
        {/* <div className="flex gap-6">
          <span className="text-[#a6ff4d]">Modern</span>
          <span className="text-[#c306aa]">Elegant</span>
          <span className="text-[#4dffff]">Futuristic</span>
          <span className="text-[#8f03d1]">Glitching</span>
        </div> */}
      </div>
    )
  }