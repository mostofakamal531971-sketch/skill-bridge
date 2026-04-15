'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Video, Calendar, Download, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { recentBookings, tutors } from '@/lib/mock-data';

export default function StudentSessionDetails() {
  const { id } = useParams();
  const booking = recentBookings.find((b) => b.id === id) || recentBookings[0];
  const tutor = tutors.find((t) => t.id === booking.tutorId);

  return (
    <>
      <Link href="/dashboard/sessions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Sessions
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bento-card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-foreground mb-1">{booking.subject}</h2>
                <p className="text-sm text-muted-foreground">Booking #{booking.id}</p>
              </div>
              <StatusBadge status={booking.status} size="md" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                <p className="text-sm font-semibold text-foreground">{booking.date} at {booking.time}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="text-sm font-semibold text-foreground">{booking.duration}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                <p className="text-xs text-muted-foreground mb-1">Amount Paid</p>
                <p className="text-sm font-semibold text-foreground">${booking.amount}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                <p className="text-xs text-muted-foreground mb-1">Meeting Link</p>
                {booking.meetingLink ? (
                  <a href={booking.meetingLink} className="text-sm font-semibold text-primary hover:underline truncate block">{booking.meetingLink}</a>
                ) : (
                  <p className="text-sm text-muted-foreground">Not available yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bento-card">
            <h3 className="font-bold text-foreground mb-3">Session Notes</h3>
            <p className="text-sm text-muted-foreground">{booking.notes || 'No notes added yet.'}</p>
          </div>

          {/* Attachments */}
          <div className="bento-card">
            <h3 className="font-bold text-foreground mb-3">Attachments</h3>
            {booking.attachments.length > 0 ? (
              <div className="space-y-2">
                {booking.attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{file}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-primary"><Download className="w-3 h-3 mr-1" />Download</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No attachments.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tutor Info */}
          <div className="bento-card">
            <h3 className="font-bold text-foreground mb-4">Tutor</h3>
            {tutor && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary ${tutor.online ? 'status-online' : ''}`}>{tutor.image}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tutor.name}</p>
                    <p className="text-xs text-muted-foreground">{tutor.subject} Expert</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{tutor.bio}</p>
                <Link href={`/tutors/${tutor.id}`}>
                  <Button size="sm" variant="outline" className="w-full border-white/[0.08] rounded-xl">View Profile</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bento-card space-y-3">
            <h3 className="font-bold text-foreground mb-2">Actions</h3>
            {booking.status === 'confirmed' && (
              <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl"><Video className="w-4 h-4 mr-2" />Join Session</Button>
            )}
            <Button variant="outline" className="w-full border-white/[0.08] rounded-xl"><MessageSquare className="w-4 h-4 mr-2" />Message Tutor</Button>
            <Button variant="outline" className="w-full border-white/[0.08] rounded-xl"><Calendar className="w-4 h-4 mr-2" />Reschedule</Button>
          </div>
        </div>
      </div>
    </>
  );
}
