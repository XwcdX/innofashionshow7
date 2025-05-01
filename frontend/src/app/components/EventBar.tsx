"use client";

import ScrollVelocity from './ScrollVelocity';

export default function EventBar() {
  return (
    <section className="min-h-[50vh] bg-primary text-dark py-16">
      <div className="container mx-auto">
        <h2 className="font-moderniz text-4xl md:text-5xl font-bold mb-12 text-center">
          EVENT HIGHLIGHTS
        </h2>
        
        <ScrollVelocity
          texts={['Modern', 'Elegant', 'Futuristic', 'Glitching']}
          velocity={100}
          className="text-accent text-3xl md:text-4xl font-bold mx-4"
          parallaxClassName="relative overflow-hidden py-8"
          scrollerClassName="flex whitespace-nowrap gap-8"
          numCopies={8}
          velocityMapping={{ input: [0, 1000], output: [0, 10] }}
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