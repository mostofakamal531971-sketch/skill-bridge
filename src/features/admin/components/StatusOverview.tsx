

import { cn } from '@/lib/utils'
import { ArrowUpRight, CreditCard, LucideIcon, Users, Zap } from 'lucide-react'
import { Activity } from 'react';
import { getDashboardOverviewStars } from '../services';
const StatusOverview = async() => {
    const {data} =await getDashboardOverviewStars();
console.log(data);


  return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
       {JSON.stringify(data)}
      </div>
  )
}

export default StatusOverview
