export default function Timeline() {
    return (
      <section className="min-h-screen bg-light text-dark p-8">
        <h2 className="text-4xl font-bold mb-12 text-center">TIMELINE</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {['Event 1', 'Event 2', 'Event 3'].map((event, index) => (
            <div key={index} className="p-6 border-b-2 border-accent">
              <h3 className="text-2xl font-semibold">{event}</h3>
            </div>
          ))}
        </div>
      </section>
    )
  }