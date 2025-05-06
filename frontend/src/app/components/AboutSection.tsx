// components/AboutSection.tsx
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="flex flex-col md:flex-row w-full min-h-screen text-white">
      {/* Left Section */}
      <div className="w-full md:w-1/2 relative bg-gradient-to-br from-purple-700 to-fuchsia-800 p-10 md:p-16"style={{ background: "linear-gradient(180deg, #281660 0%, #A30A99 100%)" }}>
        {/* Lines Asset (bottom-left corner) */}
        <div className="transform scale-210 absolute bottom-7 left-0 w-40 h-40">
          <Image
            src="/assets/lines1.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        <h2
          className="text-[#a6ff4d] text-5xl font-extrabold mb-6"
          style={{ fontFamily: "Moderniz, sans-serif" }}
        >
          ABOUT US
        </h2>

        <p
          className="text-sm leading-relaxed tracking-wide text-justify"
          style={{ fontFamily: "Eirene Sans Bold, sans-serif" }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vulputate ex in dolor fringilla pellentesque. Ut ut purus semper, vehicula enim sit amet, porttitor arcu. Quisque hendrerit maximus mattis. Donec vitae sapien nisi. Quisque sed laoreet ipsum, congue volutpat ipsum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam non dui ultrices mi scelerisque finibus nec id nunc. Vestibulum euismod blandit risus.
          <br />
          <br />
          Phasellus interdum, elit eu pulvinar tempus, lacus metus fermentum leo, lacinia mattis nibh odio vel est. Ut bibendum tellus nec consequat rutrum. Fusce at mi orci. Etiam vestibulum tincidunt suscipit. Aliquam vitae quam sem. Fusce lorem elit, sollicitudin sed risus eu, feugiat molestie neque. Vivamus odio velit, pretium vulputate ligula eget.
        </p>
      </div>

      {/* Right Section (Image) */}
      <div className="w-full md:w-1/2 relative h-[500px] md:h-auto">
        <Image
          src="/assets/runway.jpg"
          alt="Runway Fashion Show"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
