import { DashboardLayout } from '@/components/DashboardLayout';
import Header from '@/components/layout/Header';
import { DashboardSidebar } from '@/components/layout/SideBar';
import { getProfile } from '@/features/auth/services';
import TutorOnboarding from '@/features/tutor/components/TutorOnboarding';
import { BookOpen, DollarSign, LayoutDashboard, Settings, Shield, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const TutorDashbaordLayout = async({children}:{
    children:React.ReactNode
}) => {

  return (
    <main className='w-full '>
      
 <DashboardLayout title="Admin Dashboard" subtitle="Platform overview and management" userName="Admin User" userRole='ADMIN'>
    {children}
    </DashboardLayout>
    </main>
  )
}

export default TutorDashbaordLayout
