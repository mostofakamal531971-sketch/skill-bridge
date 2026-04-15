import { Button } from '@/components/ui/button'
import React from 'react'
import { getAllUsersByAdmin, getLatestUsers } from '../services';
import Image from 'next/image';
import Link from 'next/link';

const LatestUsersWidget = async() => {

  const response =  await getLatestUsers();
 

   
  return (
   <div className="bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-100 dark:border-zinc-900 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold tracking-tight">Latest Users</h3>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
          <Link href={"/admin/users"}>
              View All
          </Link>
            </Button>
          </div>
          <div className="space-y-6">
            {response.map((user:any, i:number) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="relative">
                   <Image
                   width={44}
                   height={44}
                   className="rounded-2xl object-cover"
                   src={user.profileAvater?.length > 0 ? user.profileAvater :  "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80"}
                   alt={user.name}
                   />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-bold group-hover:text-indigo-600 transition-colors">{user.name}</p>
                    <p className="text-[10px] text-zinc-400 font-medium tracking-tight">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-500">
                    {user.role}
                  </span>
                  <p className="text-[9px] text-zinc-300 font-bold mt-1 uppercase tracking-tighter">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}

export default LatestUsersWidget
