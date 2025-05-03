export default function RSVPButton() {
  return (
    <section className="bg-[#202021] min-h-[70vh] flex flex-col justify-center items-center p-8">
      <button
        className="
          inline-block
          px-[30px] py-[15px]
          text-lg
          bg-gradient-to-r from-[#8f03d1] to-[#c306aa]
          text-[#a6ff4d]
          border-none
          rounded-lg
          transition-all
          duration-300
          ease-in-out
          shadow-[0_5px_0_#8f03d1]
          cursor-pointer
          hover:-translate-y-[3px]
          hover:shadow-[0_10px_15px_rgba(143,3,209,0.5)]
          active:translate-y-[2px]
          active:shadow-none
          focus:outline-none
        "
        style={{ fontFamily: "Moderniz, sans-serif" }}
      >
        RSVP NOW
      </button>
    </section>
  );
}
