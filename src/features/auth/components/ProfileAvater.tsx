import {
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Loader2,
  Settings,
  User,
  User2
} from 'lucide-react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import LogoutButton from './logoutButton';

interface UserData {
  name: string;
  email: string;
  role: "ADMIN" | "TUTOR" | "STUDENT";
  profileAvater?: string;
}

type Props = {
  data: {
    user: UserData | null;
    isLoading: boolean;
    isError: boolean;
  }
}

const ProfileAvatar = ({ data }: Props) => {
  const { user, isLoading, isError } = data;

  // Helper to determine dashboard link based on role
  const getDashboardHref = () => {
    if (user?.role === "ADMIN") return "/admin";
    if (user?.role === "TUTOR") return "/tutor/dashboard";
    return "/dashboard";
  };

  if (isLoading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || isError) {
    return (
      <Button 
        asChild
        variant="outline" 
        className="group h-9 rounded-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300"
      >
        <Link href="/sign-in" className="flex items-center gap-2">
          <User2 className="h-4 w-4" />
          <span className="text-sm font-medium">Sign In</span>
          <span className="opacity-50 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none ml-2 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full transition-all">
          <Avatar className="h-9 w-9 border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer shadow-sm">
            <AvatarImage src={user.profileAvater} alt={user.name} />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 p-2 mt-2" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-zinc-900 dark:text-zinc-100">{user.name}</p>
            <p className="text-xs leading-none text-zinc-500 dark:text-zinc-400 mt-1 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/30">
            <Link href={getDashboardHref()} className="flex w-full items-center">
              <LayoutDashboard className="mr-3 h-4 w-4 text-zinc-500" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/30">
            <Link href={`${getDashboardHref()}/profile`} className="flex w-full items-center">
              <User className="mr-3 h-4 w-4 text-zinc-500" />
              <span className="font-medium">Profile Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg focus:bg-indigo-50 dark:focus:bg-indigo-950/30">
            <Link href="/dashboard/billing" className="flex w-full items-center">
              <CreditCard className="mr-3 h-4 w-4 text-zinc-500" />
              <span className="font-medium">Billing</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg">
            <Link href="/settings" className="flex w-full items-center">
              <Settings className="mr-3 h-4 w-4 text-zinc-500" />
              <span className="font-medium">General Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg">
            <Link href="/support" className="flex w-full items-center">
              <LifeBuoy className="mr-3 h-4 w-4 text-zinc-500" />
              <span className="font-medium">Support</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="pt-1">
          <LogoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu> 
  );
};

export default ProfileAvatar;
