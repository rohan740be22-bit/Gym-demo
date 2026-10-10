import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';
import { SearchInput, FilterSelect, StatusBadge } from '@/components/ui/Common';
import { Link } from 'react-router-dom';

export default function TrainerClients() {
  const { user } = useAuth();
  const { assessments, sessions, clientsForTrainer, settings } = useGym();
  const trainerId = user?.trainerId || 't1';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const myClients = clientsForTrainer(trainerId);
  const filtered = myClients.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.goal.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.membershipStatus.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-light">My Clients</h2>
        <p className="text-sm text-text-mute mt-1">{settings.permissions.trainerSeeAllClients ? 'Broader access is enabled, so every directory client is listed.' : 'Showing only clients assigned to you.'}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search by name or goal..." /></div>
        <div className="sm:w-48">
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'expiring', label: 'Expiring' },
              { value: 'suspended', label: 'Suspended' },
            ]}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => {
          const lastAssessment = assessments.filter((a) => a.memberId === client.id).slice(-1)[0];
          const nextSession = sessions.find((s) => s.memberId === client.id && s.status === 'upcoming');
          return (
            <Link
              key={client.id}
              to={`/trainer/clients/${client.id}`}
              className="card-dark p-5 hover:border-lime/30 transition-colors group"
            >
              <div className="flex items-start gap-4 mb-4">
                <img src={client.profileImage} alt={client.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-text-light group-hover:text-lime transition-colors">{client.name}</h3>
                  <StatusBadge status={client.membershipStatus} />
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-text-mute">Goal</span><span className="text-text-light text-right max-w-[150px] truncate">{client.goal}</span></div>
                <div className="flex justify-between"><span className="text-text-mute">Weight</span><span className="text-text-light">{client.weight} kg</span></div>
                <div className="flex justify-between"><span className="text-text-mute">Last Assessment</span><span className="text-text-light">{lastAssessment ? lastAssessment.date : 'None'}</span></div>
                <div className="flex justify-between"><span className="text-text-mute">Next Session</span><span className="text-lime">{nextSession ? nextSession.date : 'Not scheduled'}</span></div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card-dark p-12 text-center">
          <p className="text-sm text-text-mute">No clients match your search.</p>
        </div>
      )}
    </div>
  );
}
