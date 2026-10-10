import { useGym } from '@/context/GymStore';

export default function FacilitiesPage() {
  const { facilities } = useGym();
  return (
    <div className="bg-ink-900 text-text-light">
      <section className="pt-32 pb-16 section-padding">
        <div className="container-max max-w-4xl">
          <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-4 block">Facilities</span>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Every Tool You Need</h1>
          <p className="mt-6 text-xl text-text-mute max-w-2xl">
            Six dedicated training zones equipped with premium-grade equipment. Built for strength, conditioning, recovery, and everything in between.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="container-max space-y-16 lg:space-y-24">
          {facilities.map((f, i) => (
            <div key={f.id} className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:[&>img]:order-2' : ''}`}>
              <div className="relative overflow-hidden rounded-2xl group">
                <img
                  src={f.image}
                  alt={f.alt}
                  className="w-full h-72 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-ink-900/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5">
                  <span className="text-xs font-bold text-lime">0{i + 1}</span>
                </div>
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">{f.title}</h2>
                <p className="text-text-mute text-lg leading-relaxed mb-6">{f.description}</p>
                <ul className="space-y-2.5">
                  {f.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-text-light">
                      <span className="w-1.5 h-1.5 bg-lime rounded-full" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
