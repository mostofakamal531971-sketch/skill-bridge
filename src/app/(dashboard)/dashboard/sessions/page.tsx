'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Video, RotateCcw, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { DataTable } from '@/components/dashboard/DataTable';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ConfirmDialog } from '@/components/dashboard/ConfirmDialog';
import { recentBookings } from '@/lib/mock-data';
import { toast } from 'sonner';

export default function StudentSessions() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [cancelDialog, setCancelDialog] = useState<string | null>(null);

  const myBookings = recentBookings.filter((b) => b.studentId === 'stu-1');

  const filtered = myBookings.filter((b) => {
    const matchSearch = b.subject.toLowerCase().includes(search.toLowerCase()) || b.tutor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const perPage = 5;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleCancel = () => {
    toast.success('Session cancelled successfully');
    setCancelDialog(null);
  };

  const columns = [
    { key: 'id', header: 'ID', render: (b: typeof myBookings[0]) => <span className="font-mono text-xs text-muted-foreground">{b.id}</span> },
    { key: 'subject', header: 'Subject', render: (b: typeof myBookings[0]) => <Link href={`/dashboard/sessions/${b.id}`} className="text-foreground font-medium hover:text-primary">{b.subject}</Link> },
    { key: 'tutor', header: 'Tutor', render: (b: typeof myBookings[0]) => <span className="text-muted-foreground">{b.tutor}</span> },
    { key: 'date', header: 'Date & Time', render: (b: typeof myBookings[0]) => <span className="text-muted-foreground">{b.date} {b.time}</span> },
    { key: 'duration', header: 'Duration', render: (b: typeof myBookings[0]) => <span className="text-muted-foreground">{b.duration}</span> },
    { key: 'status', header: 'Status', render: (b: typeof myBookings[0]) => <StatusBadge status={b.status} size="md" /> },
    {
      key: 'actions', header: 'Actions', render: (b: typeof myBookings[0]) => (
        <div className="flex gap-1">
          {b.status === 'confirmed' && (
            <>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-primary hover:text-primary"><Video className="w-3 h-3 mr-1" />Join</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground"><RotateCcw className="w-3 h-3 mr-1" />Reschedule</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => setCancelDialog(b.id)}><XIcon className="w-3 h-3" /></Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="My Sessions" description="View and manage all your booked sessions" />

      <div className="bento-card">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search sessions..."
          filters={[{ label: 'All Status', value: 'status', options: [{ label: 'Confirmed', value: 'confirmed' }, { label: 'Completed', value: 'completed' }, { label: 'Cancelled', value: 'cancelled' }, { label: 'Pending', value: 'pending' }] }]}
          filterValues={{ status: statusFilter }}
          onFilterChange={(_, v) => { setStatusFilter(v); setPage(1); }}
        />
        <DataTable columns={columns} data={paginated} keyExtractor={(b) => b.id} page={page} totalPages={totalPages} onPageChange={setPage} emptyTitle="No sessions found" emptyDescription="Book a session with a tutor to get started" />
      </div>

      <ConfirmDialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)} title="Cancel Session" description="Are you sure you want to cancel this session? This action cannot be undone." confirmLabel="Cancel Session" onConfirm={handleCancel} destructive />
    </>
  );
}

