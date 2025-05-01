export default function RSVPButton() {
  return (
    <section className="bg-[#202021] min-h-[70vh] flex flex-col justify-center items-center p-8">
      <button className="
        inline-block
        px-[30px] py-[15px]
        text-lg
        bg-gradient-to-r from-[#c22bb8] to-[#a6108a]
        text-white
        border-none
        rounded-lg
        transition-all
        duration-300
        ease-in-out
        shadow-[0_5px_0_#a6108a]
        cursor-pointer
        hover:-translate-y-[3px]
        hover:shadow-[0_10px_15px_rgba(255,35,182,0.6)]
        active:translate-y-[2px]
        active:shadow-none
        focus:outline-none
      "
      style={{ fontFamily: "Eirene Sans Bold, sans-serif" }}
      >
        RSVP NOW
      </button>
    </section>
  )
}