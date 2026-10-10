import { Link } from 'react-router-dom';
import { OccupancyIndicator } from '@/components/ui/OccupancyIndicator';
import { hourlyOccupancy } from '@/data/mockData';
import { useGym } from '@/context/GymStore';
import { BarChart } from '@/components/ui/Charts';

export default function OccupancyPage() {
  const { accessEvents } = useGym();
  return (
    <div className="bg-ink-900 text-text-light">
      <section className="pt-32 pb-16 section-padding">
        <div className="container-max max-w-4xl">
          <span className="text-xs font-bold tracking-[0.2em] text-lime uppercase mb-4 block">Live Occupancy</span>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Gym Occupancy</h1>
          <p className="mt-6 text-xl text-text-mute max-w-2xl">
            Plan your visit with this demonstration count. It changes when the admin desk simulates entries and exits. It is not a live door feed.
          </p>
        </div>
      </section>

      <section className="section-padding pb-16">
        <div className="container-max space-y-8">
          <OccupancyIndicator />

          <div className="card-dark p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Today's Hourly Occupancy</h2>
              <span className="text-xs text-text-mute">Demo data — simulated pattern</span>
            </div>
            <BarChart
              data={hourlyOccupancy.map((h) => ({ label: h.hour, value: h.count }))}
              valueFormat={(v) => `${v} people`}
              height={200}
            />
            <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div>
                <div className="text-xs text-text-mute uppercase tracking-wide">Peak Hour</div>
                <div className="text-lg font-bold text-text-light mt-1">6 PM — 72 people</div>
              </div>
              <div>
                <div className="text-xs text-text-mute uppercase tracking-wide">Quietest Hour</div>
                <div className="text-lg font-bold text-text-light mt-1">10 PM — 8 people</div>
              </div>
              <div>
                <div className="text-xs text-text-mute uppercase tracking-wide">Best Time to Visit</div>
                <div className="text-lg font-bold text-lime mt-1">11 AM – 2 PM</div>
              </div>
            </div>
          </div>

          <div className="card-dark p-6 lg:p-8">
            <h2 className="text-xl font-bold mb-6">Recent Access Events</h2>
            <div className="space-y-2">
              {accessEvents.slice(0, 8).map((event) => (
                <div key={event.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      event.eventType === 'entry' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        {event.eventType === 'entry' ? <path d="M15 3h6v6M10 14L21 3M21 14v7H3V3h7" /> : <path d="M9 21H3v-6M14 10L3 21M3 10V3h7" />}
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-light">{event.memberName}</div>
                      <div className="text-xs text-text-mute">{event.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-mute capitalize">{event.eventType}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      event.result === 'granted' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {event.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/memberships" className="btn-primary">Join to Get Access</Link>
            <Link to="/contact" className="btn-secondary">Ask About Visiting</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
