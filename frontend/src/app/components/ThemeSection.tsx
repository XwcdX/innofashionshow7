export default function ThemeSection() {
    return (
      <section className="min-h-screen bg-dark text-secondary flex flex-col justify-center items-center p-8">
        {/* System font stack for elegant headline */}
        <h1 className="font-[system-ui] text-6xl font-bold mb-6 tracking-tight">
          ILLUMINÉ
        </h1>
        <p className="font-[system-ui] text-xl max-w-2xl text-center">
          A French-inspired take on illuminate for a high-fashion feel.
        </p>
      </section>
    );
  }