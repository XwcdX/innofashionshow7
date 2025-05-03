import ScrollReveal from "./ScrollReveal";

export default function ThemeSection() {
  return (
    <div className="bg-[#202021] min-h-screen p-8 flex flex-col justify-center items-center">
      {/* Headline */}
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={10}
        delay={0.1}
        className="w-full text-center"
      >
        <h1
          className="text-[#a6ff4d] font-bold text-6xl mb-4"
          style={{ fontFamily: "Moderniz, sans-serif" }}
        >
          ILLUMINÉ
        </h1>
      </ScrollReveal>

      {/* Subheadline */}
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={10}
        delay={0.2}
        className="w-full text-center"
      >
        <p
          className="text-[#8f03d1] text-xl mb-6"
          style={{ fontFamily: "Eirene Sans Bold, sans-serif" }}
        >
          <span className="text-[#8f03d1] font-semibold">
            A French-inspired take on &ldquo;illuminate&rdquo; for a high-fashion feel.
          </span>
        </p>
      </ScrollReveal>

      {/* Divider */}
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        blurStrength={10}
        delay={0.3}
        className="w-full text-center"
      >
        <p
          className="text-white text-lg mb-6 max-w-xl mx-auto"
          style={{ fontFamily: "Eirene Sans Bold, sans-serif" }}
        >
          ───────────────────────────────
        </p>
      </ScrollReveal>

      {/* Event info */}
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={10}
        delay={0.4}
        className="w-full text-center"
      >
        <p
          className="text-[#8f03d1] text-lg max-w-xl mx-auto"
          style={{ fontFamily: "Eirene Sans Bold, sans-serif" }}
        >
          See you on <span className="text-[#c306aa] font-semibold">15th June 2025</span> at{' '}
          <span className="text-[#c306aa] font-semibold">Tunjungan Plaza Convention Hall</span> or watch our{' '}
          <span className="text-[#c306aa] font-semibold">live streaming</span>.
        </p>
      </ScrollReveal>
    </div>
  );
}