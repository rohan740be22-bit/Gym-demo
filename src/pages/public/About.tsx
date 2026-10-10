import { images } from '@/data/mockData';
import { useGym } from '@/context/GymStore';

export default function AboutPage() {
  const { siteStats, content } = useGym();
  return (
    <div className="bg-ink-900 text-text-light">
      <section className="pt-32 pb-16 section-padding">
        <div className="container-max max-w-4xl">
          <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-4 block">About Us</span>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight whitespace-pre-line">{content.aboutHeading}</h1>
          <p className="mt-6 text-xl text-text-mute leading-relaxed max-w-2xl">
            {content.aboutBody}
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="container-max">
          <img src={images.about} alt={images.aboutAlt} className="w-full h-[400px] lg:h-[600px] object-cover rounded-2xl" />
        </div>
      </section>

      <section className="section-padding py-24 bg-ink-800 border-y border-border">
        <div className="container-max">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Active Members', value: siteStats.members.toLocaleString() },
              { label: 'Certified Trainers', value: siteStats.trainers },
              { label: 'Training Programs', value: siteStats.programs },
              { label: 'Years of Experience', value: `${siteStats.years}+` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-lime">{s.value}</div>
                <div className="text-sm text-text-mute mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding py-24">
        <div className="container-max max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Our Philosophy</h2>
          <div className="space-y-8">
            {[
              { title: 'Strength First', text: 'We believe strength is the foundation of all physical progress. Every program starts with building a solid base of strength.' },
              { title: 'Consistency Over Intensity', text: 'Sustainable progress comes from showing up, not from burning out. We design programs that fit real life.' },
              { title: 'Intelligent Coaching', text: 'Our trainers don\'t just count reps. They analyze movement, adjust programming, and guide every step of your journey.' },
              { title: 'Community of Disciplined People', text: 'Forge is surrounded by people who take their training seriously. The culture pushes everyone to improve.' },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-lime pl-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-text-mute leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
