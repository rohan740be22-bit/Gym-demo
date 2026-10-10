import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Common';

export default function MemberProfile() {
  const { user } = useAuth();
  const { members, trainers, updateMember } = useGym();
  const member = members.find((m) => m.id === user?.memberId) || members[0];
  const trainer = trainers.find((t) => t.id === member.trainerId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: member.phone, goal: member.goal, emergencyContact: member.emergencyContact, dietaryPrefs: member.dietaryPrefs, allergies: member.allergies });

  const fields = [
    { label: 'Full Name', value: member.name, editable: false },
    { label: 'Date of Birth', value: member.dob, editable: false },
    { label: 'Height', value: member.height, editable: false },
    { label: 'Current Weight', value: `${member.weight} kg`, editable: false },
    { label: 'Fitness Goal', value: member.goal, editable: true, key: 'goal' as const },
    { label: 'Emergency Contact', value: member.emergencyContact, editable: true, key: 'emergencyContact' as const },
    { label: 'Phone', value: member.phone, editable: true, key: 'phone' as const },
    { label: 'Assigned Trainer', value: trainer?.name || 'Unassigned', editable: false },
    { label: 'Dietary Preferences', value: member.dietaryPrefs, editable: true, key: 'dietaryPrefs' as const },
    { label: 'Allergies', value: member.allergies, editable: true, key: 'allergies' as const },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card-dark p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img src={member.profileImage} alt={member.name} className="w-24 h-24 rounded-xl object-cover border border-border" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-light">{member.name}</h2>
              <StatusBadge status={member.membershipStatus} />
            </div>
            <p className="text-sm text-text-mute mt-1">{member.email}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="px-3 py-1.5 bg-ink-900 rounded-lg border border-border text-xs">
                <span className="text-text-mute">Plan: </span>
                <span className="text-lime font-semibold">{member.membershipPlan}</span>
              </div>
              <div className="px-3 py-1.5 bg-ink-900 rounded-lg border border-border text-xs">
                <span className="text-text-mute">Member #: </span>
                <span className="text-text-light font-semibold">{member.membershipNumber}</span>
              </div>
              <div className="px-3 py-1.5 bg-ink-900 rounded-lg border border-border text-xs">
                <span className="text-text-mute">Joined: </span>
                <span className="text-text-light font-semibold">{member.joinDate}</span>
              </div>
            </div>
          </div>
          <button onClick={() => { setForm({ phone: member.phone, goal: member.goal, emergencyContact: member.emergencyContact, dietaryPrefs: member.dietaryPrefs, allergies: member.allergies }); setEditing(true); }} className="btn-secondary">Edit Profile</button>
        </div>
      </div>

      <div className="card-dark p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-light">Personal Information</h3>
          <span className="text-xs text-text-mute flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Private — visible to you and authorized staff
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {fields.map((f) => (
            <div key={f.label} className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-text-mute">{f.label}</span>
              <span className="text-sm text-text-light mt-1">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Profile">
        <div className="space-y-4">
          {fields.filter((f) => f.editable).map((f) => (
            <div key={f.key}>
              <label className="input-label">{f.label}</label>
              <input
                className="input-field"
                defaultValue={f.value}
                onChange={(e) => setForm({ ...form, [f.key!]: e.target.value })}
              />
            </div>
          ))}
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => { updateMember(member.id, form); setEditing(false); }} className="btn-primary">Save Changes</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
