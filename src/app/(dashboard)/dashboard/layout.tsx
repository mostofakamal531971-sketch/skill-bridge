import { DashboardLayout } from '@/components/DashboardLayout';
import Header from '@/components/layout/Header';
import { DashboardSidebar } from '@/components/layout/SideBar';
import { getProfile } from '@/features/auth/services';
import { redirect } from 'next/navigation';
import React from 'react'

const StudentDashboardLayout = async({children}:{
    children:React.ReactNode
}) => {


  return (
    <main className='w-full '>
<DashboardLayout title="Dashboard" subtitle="Welcome to your dashboard">
  
      {children}
    </DashboardLayout>
  </main>
);
};

export default StudentDashboardLayout;
