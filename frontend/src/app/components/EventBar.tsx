export default function EventBar() {
    return (
      <section className="min-h-[50vh] bg-primary text-dark p-8">
        <div className="flex overflow-x-auto gap-8 py-4">
          {['Modern', 'Elegant', 'Futuristic', 'Glitching'].map((item) => (
            <div key={item} className="flex-shrink-0 px-6 py-3 bg-accent rounded-lg text-xl font-medium">
              {item}
            </div>
          ))}
        </div>
      </section>
    )
  }