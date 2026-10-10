import { useState } from 'react';
import { useGym } from '@/context/GymStore';

export default function ContactPage() {
  const { settings } = useGym();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-ink-900 text-text-light">
      <section className="pt-32 pb-16 section-padding">
        <div className="container-max max-w-4xl">
          <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-4 block">Contact</span>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Get in Touch</h1>
          <p className="mt-6 text-xl text-text-mute max-w-2xl">
            Questions about membership, training, or visiting the gym? We're here to help.
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="container-max">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
            <div className="card-dark p-6 lg:p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-success/15 text-success rounded-full flex items-center justify-center mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-light">Message Sent</h3>
                  <p className="text-sm text-text-mute mt-2 max-w-sm">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary mt-6">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold mb-2">Send a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">First Name</label>
                      <input className="input-field" placeholder="John" required />
                    </div>
                    <div>
                      <label className="input-label">Last Name</label>
                      <input className="input-field" placeholder="Doe" required />
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Email</label>
                    <input type="email" className="input-field" placeholder="john@email.com" required />
                  </div>
                  <div>
                    <label className="input-label">Subject</label>
                    <select className="input-field cursor-pointer">
                      <option className="bg-ink-900">Membership Inquiry</option>
                      <option className="bg-ink-900">Personal Training</option>
                      <option className="bg-ink-900">Facility Tour</option>
                      <option className="bg-ink-900">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Message</label>
                    <textarea className="input-field min-h-[120px] resize-y" placeholder="How can we help?" required />
                  </div>
                  <button type="submit" className="btn-primary w-full">Send Message</button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="card-dark p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-mute mb-3">Visit Us</h3>
                <p className="text-sm text-text-light leading-relaxed">{settings.address}</p>
              </div>
              <div className="card-dark p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-mute mb-3">Contact</h3>
                <p className="text-sm text-text-light">{settings.phone}</p>
                <p className="text-sm text-text-light mt-1">{settings.email}</p>
              </div>
              <div className="card-dark p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-mute mb-3">Opening Hours</h3>
                <ul className="space-y-2">
                  {settings.hours.map((h) => (
                    <li key={h.day} className="flex justify-between text-sm">
                      <span className="text-text-mute">{h.day}</span>
                      <span className="text-text-light font-medium">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
