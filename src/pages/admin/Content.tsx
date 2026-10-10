import { useState } from 'react';
import { useGym, type SiteContent } from '@/context/GymStore';
import { TabBar } from '@/components/ui/Common';

export default function AdminContent() {
  const { content, facilities, testimonials, trainers, siteStats, updateContent, updateFacility, updateTestimonial, addTestimonial, removeTestimonial, updateTrainer, updateSiteStats } = useGym();
  const [tab, setTab] = useState('home');
  const [draft, setDraft] = useState<SiteContent>(content);
  const [stats, setStats] = useState(siteStats);
  const [notice, setNotice] = useState('');
  const [quote, setQuote] = useState({ name: '', role: 'Member', quote: '' });

  const saveHome = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent(draft);
    updateSiteStats(stats);
    setNotice('Homepage copy saved. Refresh the public site to see it — it is already live in this preview.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-light">Website Content</h2>
        <p className="text-sm text-text-mute mt-1">Edits update the public pages in this prototype. Images stay as the bundled photography.</p>
      </div>
      {notice && <div className="px-4 py-3 rounded-lg border border-lime/30 bg-lime/10 text-sm text-lime">{notice}</div>}
      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'home', label: 'Homepage' },
          { id: 'facilities', label: 'Facilities' },
          { id: 'trainers', label: 'Trainers' },
          { id: 'stories', label: 'Testimonials' },
        ]}
      />

      {tab === 'home' && (
        <form onSubmit={saveHome} className="card-dark p-6 space-y-4">
          <div><label className="input-label">Eyebrow</label><input className="input-field" value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></div>
          <div><label className="input-label">Hero headline</label><input className="input-field" value={draft.heroHeadline} onChange={(e) => setDraft({ ...draft, heroHeadline: e.target.value })} /></div>
          <div><label className="input-label">Hero support</label><textarea className="input-field" value={draft.heroSupport} onChange={(e) => setDraft({ ...draft, heroSupport: e.target.value })} /></div>
          <div><label className="input-label">About heading</label><input className="input-field" value={draft.aboutHeading} onChange={(e) => setDraft({ ...draft, aboutHeading: e.target.value })} /></div>
          <div><label className="input-label">About copy</label><textarea className="input-field min-h-[100px]" value={draft.aboutBody} onChange={(e) => setDraft({ ...draft, aboutBody: e.target.value })} /></div>
          <div><label className="input-label">Closing headline</label><input className="input-field" value={draft.ctaHeadline} onChange={(e) => setDraft({ ...draft, ctaHeadline: e.target.value })} /></div>
          <div><label className="input-label">Announcement bar</label><input className="input-field" value={draft.announcement} onChange={(e) => setDraft({ ...draft, announcement: e.target.value })} placeholder="Leave blank to hide" /></div>
          <div className="grid sm:grid-cols-4 gap-3">
            <div><label className="input-label">Members</label><input type="number" className="input-field" value={stats.members} onChange={(e) => setStats({ ...stats, members: Number(e.target.value) })} /></div>
            <div><label className="input-label">Trainers</label><input type="number" className="input-field" value={stats.trainers} onChange={(e) => setStats({ ...stats, trainers: Number(e.target.value) })} /></div>
            <div><label className="input-label">Programs</label><input type="number" className="input-field" value={stats.programs} onChange={(e) => setStats({ ...stats, programs: Number(e.target.value) })} /></div>
            <div><label className="input-label">Years</label><input type="number" className="input-field" value={stats.years} onChange={(e) => setStats({ ...stats, years: Number(e.target.value) })} /></div>
          </div>
          <button className="btn-primary">Save homepage</button>
        </form>
      )}

      {tab === 'facilities' && (
        <div className="space-y-4">
          {facilities.map((f) => (
            <FacilityEditor key={f.id} id={f.id} title={f.title} description={f.description} onSave={(description) => { updateFacility(f.id, { description }); setNotice(`${f.title} updated on the public site.`); }} />
          ))}
        </div>
      )}

      {tab === 'trainers' && (
        <div className="space-y-4">
          <p className="text-sm text-text-mute">Short bios shown on the trainers page. Hours and assignments live under Trainer Management.</p>
          {trainers.map((t) => (
            <TrainerBio key={t.id} name={t.name} bio={t.bio} specialization={t.specialization} onSave={(bio, specialization) => { updateTrainer(t.id, { bio, specialization }); setNotice(`${t.name} updated.`); }} />
          ))}
        </div>
      )}

      {tab === 'stories' && (
        <div className="space-y-4">
          <p className="text-xs text-warning">These quotes are placeholders, not verified reviews.</p>
          {testimonials.map((t) => (
            <form key={t.id} className="card-dark p-5 space-y-3" onSubmit={(e) => { e.preventDefault(); const data = new FormData(e.currentTarget); updateTestimonial(t.id, { name: String(data.get('name')), role: String(data.get('role')), quote: String(data.get('quote')) }); setNotice('Testimonial updated.'); }}>
              <div className="grid sm:grid-cols-2 gap-3">
                <input name="name" className="input-field" defaultValue={t.name} />
                <input name="role" className="input-field" defaultValue={t.role} />
              </div>
              <textarea name="quote" className="input-field min-h-[80px]" defaultValue={t.quote} />
              <div className="flex justify-between">
                <button type="button" className="btn-ghost text-error" onClick={() => removeTestimonial(t.id)}>Remove</button>
                <button className="btn-primary">Save quote</button>
              </div>
            </form>
          ))}
          <form className="card-dark p-5 space-y-3" onSubmit={(e) => { e.preventDefault(); if (!quote.name || !quote.quote) return; addTestimonial(quote); setQuote({ name: '', role: 'Member', quote: '' }); setNotice('Placeholder testimonial added.'); }}>
            <h3 className="font-semibold">Add a placeholder quote</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input-field" placeholder="Name" value={quote.name} onChange={(e) => setQuote({ ...quote, name: e.target.value })} />
              <input className="input-field" placeholder="Role" value={quote.role} onChange={(e) => setQuote({ ...quote, role: e.target.value })} />
            </div>
            <textarea className="input-field min-h-[80px]" placeholder="Quote" value={quote.quote} onChange={(e) => setQuote({ ...quote, quote: e.target.value })} />
            <button className="btn-secondary">Add testimonial</button>
          </form>
        </div>
      )}
    </div>
  );
}

function FacilityEditor({ title, description, onSave }: { id: string; title: string; description: string; onSave: (description: string) => void }) {
  const [value, setValue] = useState(description);
  return (
    <form className="card-dark p-5 space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(value); }}>
      <h3 className="font-semibold">{title}</h3>
      <textarea className="input-field min-h-[80px]" value={value} onChange={(e) => setValue(e.target.value)} />
      <button className="btn-primary">Save facility</button>
    </form>
  );
}

function TrainerBio({ name, bio, specialization, onSave }: { name: string; bio: string; specialization: string; onSave: (bio: string, specialization: string) => void }) {
  const [text, setText] = useState(bio);
  const [spec, setSpec] = useState(specialization);
  return (
    <form className="card-dark p-5 space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(text, spec); }}>
      <h3 className="font-semibold">{name}</h3>
      <input className="input-field" value={spec} onChange={(e) => setSpec(e.target.value)} />
      <textarea className="input-field min-h-[80px]" value={text} onChange={(e) => setText(e.target.value)} />
      <button className="btn-primary">Save profile</button>
    </form>
  );
}
