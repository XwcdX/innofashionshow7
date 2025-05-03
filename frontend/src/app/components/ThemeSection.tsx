export default function ThemeSection() {
  return (
    <div className="bg-[#202021] min-h-screen p-8 flex flex-col justify-center items-center">
      {/* Headline */}
      <h1
        className="text-[#a6ff4d] font-bold text-6xl mb-4"
        style={{ fontFamily: "Moderniz, sans-serif" }}
      >
        ILLUMINÉ
      </h1>

      {/* Subheadline */}
      <p
        className="text-[#8f03d1] text-xl mb-15 text-center"
        style={{ fontFamily: "Eirene Sans Bold, sans-serif" }}
      >
        <span className="text-[#8f03d1] font-semibold">A French-inspired take on &ldquo;illuminate&rdquo; for a high-fashion feel.</span>
      </p>

      {/* Event info */}
      <p
        className="text-[#4dffff] text-lg text-center max-w-xl"
        style={{ fontFamily: "Eirene Sans Bold, sans-serif" }}
      >
        See you on <span className="text-[#a6ff4d] font-semibold">15th June 2025</span> at <span className="text-[#c306aa] font-semibold">Tunjungan Plaza Convention Hall</span> or watch our <span className="text-[#8f03d1] font-semibold">live streaming</span>.
      </p>
    </div>
  )
}
