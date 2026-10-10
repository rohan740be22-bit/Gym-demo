import { Link } from 'react-router-dom';
import { useGym } from '@/context/GymStore';

export default function MembershipsPage() {
  const { membershipPlans } = useGym();
  const plans = membershipPlans.filter((plan) => plan.active !== false);
  return (
    <div className="bg-ink-900 text-text-light">
      <section className="pt-32 pb-16 section-padding">
        <div className="container-max max-w-4xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-4 block">Membership Plans</span>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Choose Your Tier</h1>
          <p className="mt-6 text-xl text-text-mute max-w-2xl mx-auto">
            Flexible monthly plans designed for every level of commitment. No long-term contracts — cancel anytime.
          </p>
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 lg:p-8 flex flex-col ${
                  plan.recommended
                    ? 'border-lime bg-ink-800 lg:scale-105'
                    : 'border-border bg-ink-800'
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-ink-900 text-xs font-bold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-text-mute mt-2">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-text-mute text-sm">/{plan.duration}</span>
                </div>
                <div className="mt-4 text-xs text-text-mute border-t border-border pt-4">
                  Duration: Monthly, renewable
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-text-mute">
                      <svg className="w-4 h-4 text-lime flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link to={`/register?plan=${plan.id}`} className={`mt-8 ${plan.recommended ? 'btn-primary' : 'btn-secondary'} w-full`}>
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-text-mute mt-8">Choosing a plan opens a preview registration. No payment is collected.</p>
        </div>
      </section>

      <section className="section-padding py-24 bg-ink-800 border-y border-border">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Membership?</h2>
          <p className="text-text-mute mb-8">Our team is happy to help you find the right plan for your goals.</p>
          <Link to="/contact" className="btn-primary">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
