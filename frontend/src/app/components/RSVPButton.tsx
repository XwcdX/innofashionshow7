export default function RSVPButton() {
  return (
    <section className="min-h-[70vh] bg-secondary flex flex-col justify-center items-center p-8">
      <button className="
        font-montserrat
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
      ">
        RSVP NOW
      </button>
    </section>
  )
}