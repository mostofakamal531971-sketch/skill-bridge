import { getProfile } from '@/features/auth/services';
import DashboardContent from '@/features/student-dashboard/components/DashboardContent';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function StudentOverviewPage() {
  const session = await getProfile();
  
  if (!session?.user?.data) {
    redirect('/login');
  }

  const user = session.user.data as { name: string; id: string; role: string };

  // For safety, ensure only students see this (though middleware should handle it)
  if (user.role === 'TUTOR') {
    redirect('/tutor/dashboard');
  } else if (user.role === 'ADMIN' || user.role === 'MODERATOR') {
    redirect('/admin/dashboard');
  }

  return (
    <DashboardContent 
      data={{
        name: user.name,
        id: user.id
      }} 
    />
  );
}

