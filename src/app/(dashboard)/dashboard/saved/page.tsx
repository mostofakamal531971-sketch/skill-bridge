'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { tutors, savedTutors } from '@/lib/mock-data';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getSavedTutors } from '@/features/student-dashboard/services';
import { useUser } from '@/context/UserContext';

export default function StudentSavedTutors() {
  const [search, setSearch] = useState('');
  const {user} = useUser();
  const savedidxs = user?.savedidxs as string[];
  const [saved, setSaved] = useState(savedTutors);

  const {data: savedTutorsData,isLoading,isError} = useQuery({
    queryKey: ['saved-tutors'],
    queryFn: () => getSavedTutors(),
  });
  console.log(savedTutorsData);
  
  const filtered = savedTutorsData?.data?.filter((t: any) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
  ) || [];
  const handleUnsave = (id: string) => {
    setSaved((prev) => prev.filter((s) => s !== id));
    toast.success('Tutor removed from saved list');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {savedTutorsData?.error as string}</div>;
  }


  return (
    <>
      <PageHeader title="Saved Tutors" description={`${saved.length} tutors saved`} />

      <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search saved tutors..." />

      {filtered.length === 0 ? (
        <div className="bento-card">
          <EmptyState icon={Heart} title="No saved tutors" description="Browse tutors and save your favorites for quick access" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t: any) => (
            <div key={t.id} className="bento-card group">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-lg font-bold text-primary ${t.online ? 'status-online' : ''}`}>{t.image}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">{t.subject}</p>
                </div>
                <button onClick={() => handleUnsave(t.id)} className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors">
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{t.bio}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="text-sm font-semibold">{t.rating}</span>
                  <span className="text-xs text-muted-foreground">({t.reviews})</span>
                </div>
                <span className="text-sm font-bold text-primary">${t.rate}/hr</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/tutors/${t.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full border-white/[0.08] rounded-xl">View Profile</Button>
                </Link>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 rounded-xl">
                  <Calendar className="w-3 h-3 mr-1" />Book
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

