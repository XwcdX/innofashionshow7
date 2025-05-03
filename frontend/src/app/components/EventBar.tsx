"use client";

import ScrollVelocity from './ScrollVelocity';

export default function EventBar() {
  return (
    <section className="min-h-[50vh] bg-[#202021] text-dark py-16 ">
      <div className="mx-auto bg-[#202021]"> 
        <h2 className="bg-[#202021]font-moderniz text-4xl md:text-5xl font-bold mb-12 text-[#a6ff4d] text-center">
          EVENT HIGHLIGHTS
        </h2>
        
        <ScrollVelocity
          texts={['Talkshow', 'Workshop', 'Competition', 'Fashion Show']}
          velocity={30}
          className="text-accent text-3xl md:text-4xl font-bold mx-4"
          parallaxClassName="relative overflow-hidden py-2"
          scrollerClassName="flex whitespace-nowrap gap-8"
          numCopies={6}
          velocityMapping={{ input: [0, 300], output: [0, 10] }}
        />
      </div>
    </section>
  );
}

// export default function EventBar() {
//     return (
//       <section className="min-h-[50vh] bg-primary text-dark p-8">
//         <div className="flex overflow-x-auto gap-8 py-4">
//           {['Modern', 'Elegant', 'Futuristic', 'Glitching'].map((item) => (
//             <div key={item} className="flex-shrink-0 px-6 py-3 bg-accent rounded-lg text-xl font-medium">
//               {item}
//             </div>
//           ))}
//         </div>
//       </section>
//     )
//   }