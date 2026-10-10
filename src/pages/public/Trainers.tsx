import { useState } from 'react';
import { useGym } from '@/context/GymStore';

export default function TrainersPage() {
  const { trainers } = useGym();
  const categories = ['All', ...Array.from(new Set(trainers.map((t) => t.category)))];
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? trainers : trainers.filter((t) => t.category === filter);

  return (
    <div className="bg-ink-900 text-text-light">
      <section className="pt-32 pb-16 section-padding">
        <div className="container-max max-w-4xl">
          <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-4 block">Our Team</span>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Meet the Coaches</h1>
          <p className="mt-6 text-xl text-text-mute max-w-2xl">
            Certified, experienced, and dedicated to your progress. Every trainer brings a unique specialty to help you train smarter.
          </p>
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  filter === cat
                    ? 'bg-lime text-ink-900 border-lime'
                    : 'text-text-mute border-border hover:text-text-light hover:bg-ink-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((t) => (
              <div key={t.id} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-5">
                  <img src={t.image} alt={t.alt} className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-semibold px-3 py-1.5 bg-lime/15 text-lime border border-lime/20 rounded-md backdrop-blur-sm">
                    {t.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{t.name}</h3>
                <p className="text-lime font-medium text-sm mt-1">{t.specialization}</p>
                <p className="text-text-mute text-sm mt-3 leading-relaxed">{t.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.certifications.map((cert) => (
                    <span key={cert} className="text-[10px] font-semibold px-2 py-1 bg-ink-700 text-text-mute rounded border border-border">
                      {cert}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-sm text-text-mute">
                  <span className="text-text-light font-semibold">{t.experience}</span> years of experience
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-text-mute mt-12">Fictional sample profiles for demonstration — intended to be replaced with real trainer data.</p>
        </div>
      </section>
    </div>
  );
}
