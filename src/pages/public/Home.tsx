import { Link } from 'react-router-dom';
import { images } from '@/data/mockData';
import { useGym } from '@/context/GymStore';
import { OccupancyIndicator } from '@/components/ui/OccupancyIndicator';

export default function HomePage() {
  const { facilities, membershipPlans, trainers, testimonials, siteStats, content } = useGym();
  const plans = membershipPlans.filter((plan) => plan.active !== false);
  return (
    <div className="bg-ink-900">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={images.hero} alt={images.heroAlt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/80 to-ink-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/40" />
        </div>

        <div className="relative section-padding pt-20 w-full">
          <div className="container-max max-w-3xl">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-lime mb-6 animate-slide-up">
              {content.tagline}
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.02] text-text-light animate-slide-up whitespace-pre-line" style={{ animationDelay: '0.1s' }}>
              {content.heroHeadline}
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-text-mute max-w-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {content.heroSupport}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/memberships" className="btn-primary text-base px-6 py-3">
                Explore Memberships
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link to="/facilities" className="btn-secondary text-base px-6 py-3">Explore the Gym</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Occupancy preview */}
      <section className="section-padding -mt-32 relative z-10">
        <div className="container-max">
          <OccupancyIndicator />
          <div className="mt-4 flex justify-center">
            <Link to="/occupancy" className="btn-ghost text-lime hover:text-lime-dark">
              View Live Occupancy
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section-padding py-24 lg:py-32">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <img src={images.about} alt={images.aboutAlt} className="w-full h-[500px] lg:h-[600px] object-cover rounded-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-lime text-ink-900 p-6 rounded-xl hidden sm:block">
                <div className="text-4xl font-bold">{siteStats.years}+</div>
                <div className="text-sm font-semibold mt-1">Years of Excellence</div>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-4 block">About Forge</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-text-light leading-tight whitespace-pre-line">
                {content.aboutHeading}
              </h2>
              <p className="mt-6 text-text-mute text-lg leading-relaxed">
                {content.aboutBody}
              </p>
              <div className="mt-10 grid grid-cols-2 gap-6">
                {[
                  { label: 'Members', value: siteStats.members.toLocaleString() },
                  { label: 'Certified Trainers', value: siteStats.trainers },
                  { label: 'Training Programs', value: siteStats.programs },
                  { label: 'Years of Experience', value: `${siteStats.years}+` },
                ].map((s) => (
                  <div key={s.label} className="border-l-2 border-lime pl-4">
                    <div className="text-3xl font-bold text-text-light">{s.value}</div>
                    <div className="text-sm text-text-mute mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding py-24 bg-ink-800 border-y border-border">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-3 block">Facilities</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-text-light">Train in Every Mode</h2>
            </div>
            <Link to="/facilities" className="btn-ghost text-lime">View All Facilities →</Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <Link
                key={f.id}
                to="/facilities"
                className={`group relative overflow-hidden rounded-2xl border border-border ${i === 0 ? 'lg:row-span-2' : ''}`}
              >
                <img
                  src={f.image}
                  alt={f.alt}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 0 ? 'h-full min-h-[400px]' : 'h-64'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-text-light">{f.title}</h3>
                  <p className="text-sm text-text-mute mt-1 line-clamp-2">{f.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="section-padding py-24 lg:py-32">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-3 block">Membership</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-text-light">Choose Your Tier</h2>
            <p className="mt-4 text-text-mute text-lg">Flexible monthly plans designed for every level of commitment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 lg:p-8 flex flex-col ${
                  plan.recommended
                    ? 'border-lime bg-ink-800 lg:scale-105 lg:shadow-2xl lg:shadow-lime/5'
                    : 'border-border bg-ink-800'
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-ink-900 text-xs font-bold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                )}
                <h3 className="text-2xl font-bold text-text-light">{plan.name}</h3>
                <p className="text-sm text-text-mute mt-2 min-h-[40px]">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text-light">${plan.price}</span>
                  <span className="text-text-mute text-sm">/{plan.duration}</span>
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-text-mute">
                      <svg className="w-4 h-4 text-lime flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/register?plan=${plan.id}`}
                  className={`mt-8 ${plan.recommended ? 'btn-primary' : 'btn-secondary'} w-full`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="section-padding py-24 bg-ink-800 border-y border-border">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-3 block">Our Team</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-text-light">Expert Coaches</h2>
            </div>
            <Link to="/trainers" className="btn-ghost text-lime">Meet All Trainers →</Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((t) => (
              <div key={t.id} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img src={t.image} alt={t.alt} className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 bg-lime/15 text-lime border border-lime/20 rounded-md backdrop-blur-sm">
                    {t.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-light">{t.name}</h3>
                <p className="text-sm text-lime font-medium mt-0.5">{t.specialization}</p>
                <p className="text-xs text-text-mute mt-2">{t.experience} years experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding py-24">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-3 block">Member Stories</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-text-light">Real Results</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="card-dark p-6 lg:p-8">
                <svg className="w-8 h-8 text-lime mb-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>
                <p className="text-text-light leading-relaxed mb-6">{t.quote}</p>
                <div className="border-t border-border pt-4">
                  <div className="font-semibold text-text-light">{t.name}</div>
                  <div className="text-xs text-text-mute mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-text-mute mt-6">Sample testimonials shown for demonstration — not verified reviews.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative section-padding py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={images.cta} alt="Athletic silhouette in gym" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink-900/85" />
        </div>
        <div className="relative container-max text-center max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-bold text-text-light leading-tight whitespace-pre-line">
            {content.ctaHeadline}
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-6 py-3">Join the Club</Link>
            <Link to="/contact" className="btn-secondary text-base px-6 py-3">Contact Us</Link>
            <Link to="/memberships" className="btn-ghost text-base px-6 py-3 text-lime">Explore Memberships</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
