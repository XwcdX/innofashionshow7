"use client";

import ScrollVelocity from './ScrollVelocity';
import Image from "next/image";

export default function EventBar() {
  return (
    <section
      className="min-h-[50vh] text-dark py-16 relative"
      style={{ background: "linear-gradient(180deg, #A30A99 0%, #281660 100%)" }}
    >
      <div className="mx-auto">
        <h2 className="font-moderniz text-4xl md:text-5xl font-bold mb-12 text-[#a6ff4d] text-center" style={{ fontFamily: "Moderniz, sans-serif" }}>
          Our Events
        </h2>

        <ScrollVelocity
          texts={['Talkshow', 'Workshop', 'Competition', 'Fashion Show']}
          velocity={30}
          className="text-accent text-3xl md:text-4xl font-bold mx-4"
          parallaxClassName="relative overflow-hidden py-2"
          scrollerClassName="flex whitespace-nowrap gap-8"
          numCopies={50}
          velocityMapping={{ input: [0, 300], output: [0, 10] }}
        />
      </div>
            {/* Decorative Image (bottom-right corner) */}
            <div className="transform scale-300 absolute -bottom-10 right-40 w-40 h-40">
        <Image
          src="/assets/lines2.png" // Make sure this is in your /public/assets folder
          alt="Decoration"
          fill
          className="object-contain"
          priority
        />
      </div>
      
    </section>
  );
}


// "use client";

// import ScrollVelocity from './ScrollVelocity';

// export default function EventBar() {
//   return (
//     <section className="min-h-[50vh] bg-[#202021] text-dark py-16 ">
//       <div className="mx-auto bg-[#202021]" > 
//         <h2 className="bg-[#202021]font-moderniz text-4xl md:text-5xl font-bold mb-12 text-[#a6ff4d] text-center">
//           EVENT HIGHLIGHTS
//         </h2>
        
//         <ScrollVelocity
//           texts={['Talkshow', 'Workshop', 'Competition', 'Fashion Show']}
//           velocity={30}
//           className="text-accent text-3xl md:text-4xl font-bold mx-4"
//           parallaxClassName="relative overflow-hidden py-2"
//           scrollerClassName="flex whitespace-nowrap gap-8"
//           numCopies={50}
//           velocityMapping={{ input: [0, 300], output: [0, 10] }}
//         />
//       </div>
//     </section>
//   );
// }


