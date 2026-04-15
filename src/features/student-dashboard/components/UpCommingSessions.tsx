

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, GraduationCap, CalendarDays, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { getStudentBookings } from '../services'

const UpCommingSessions = async () => {
  const { data } = await getStudentBookings();
  const upCommingSessions = data?.slice(0, 3) || [];

  return (
    <Card className="lg:col-span-4 overflow-hidden border-zinc-200/60 dark:border-zinc-800/60 shadow-sm rounded-[24px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <CalendarDays className="h-5 w-5 text-indigo-500" />
          </div>
          Upcoming Sessions
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-zinc-500 font-bold hover:text-indigo-600">
          <Link href="/dashboard/bookings" className="flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        {upCommingSessions.length > 0 ? (
          upCommingSessions.map((session: any) => (
            <div 
              key={session.id} 
              className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-transparent hover:border-indigo-500/20 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-800 shadow-sm">
                    <AvatarImage src={session.tutor.profileAvater || ""} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
                      {session.tutor.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
                </div>
                
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 leading-none mb-1">
                    {session.tutor.user.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" /> 
                      {session.tutor.category}
                    </p>
                    <span className="text-zinc-300 text-[10px]">•</span>
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                      {session.status}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                variant="secondary" 
                size="sm" 
                asChild 
                className="rounded-xl font-bold px-4 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Link href={`/dashboard/bookings/${session.id}`}>Details</Link>
              </Button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-zinc-500 font-medium">No upcoming sessions</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UpCommingSessions;
