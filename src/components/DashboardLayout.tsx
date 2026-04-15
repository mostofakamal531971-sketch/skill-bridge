"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LucideIcon, ChevronLeft, Bell, LogOut, DollarSignIcon, 
  ChevronDown, LayoutDashboard, Users, 
  BookOpen, Shield, Settings, 
  User2,
  Menu,
  SaveIcon,
  DollarSign,
  Star,
  Timer
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ProfilePopup } from "@/components/ProfilePopup";
import ThemeToggle from "@/components/shared/toggleTheme";
import { Role } from "@/interfaces";
import { useUser } from "@/context/UserContext";
import { Button } from "./ui/button";
import TutorOnboarding from "@/features/tutor/components/TutorOnboarding";

interface SubMenuItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  submenu?: SubMenuItem[];
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;

}

export function DashboardLayout({ children, title, subtitle}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const {user} = useUser();

  const initials = user?.name?.split(' ').map((n:string) => n[0]).join('');

  const navItems: Record<string, NavItem[]> = {
    ADMIN: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Bookings", href: "/admin/bookings", icon: BookOpen },
      { label: "Verification", href: "/admin/verification", icon: Shield },
      { label: "Transactions", href: "/admin/transactions", icon: DollarSignIcon },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        submenu: [
          { label: "Profile", href: "/admin/settings/profile" },
          { label: "Account", href: "/admin/settings/account" },
          { label: "General", href: "/admin/settings/general" },
        ]
      },
    ],
    STUDENT: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "My Bookings", href: "/dashboard/bookings", icon: BookOpen },
      { label: "My Payments", href: "/dashboard/payments", icon: DollarSignIcon },
      { label: "Saved Tutors", href: "/dashboard/saved", icon: SaveIcon },
      { label: "Profile", href: "/dashboard/profile", icon: User2 },
    ],
    TUTOR: [
      { label: "Overview", href: "/tutor/dashboard", icon: LayoutDashboard },
      { label: "My Sessions", href: "/tutor/dashboard/sessions", icon: BookOpen },
      { label: "Availability", href: "/tutor/dashboard/availability", icon: Timer },
      { label: "Earnings", href: "/tutor/dashboard/earnings", icon: DollarSign },
      { label: "Reviews", href: "/tutor/dashboard/my-reviews", icon: Star },
      { label: "Profile", href: "/tutor/dashboard/profile", icon: User2 },
    ],
    MODERATOR: [
      { label: "Overview", href: "/moderator/dashboard", icon: LayoutDashboard },
      { label: "Bookings", href: "/admin/bookings", icon: BookOpen },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Categories", href: "/admin/categories", icon: Settings },
    ]
  };

  const toggleSubmenu = (label: string) => {
    if (collapsed) setCollapsed(false);
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const role = user?.role || user?.role || "STUDENT";
  const activeNavItems = navItems[role as keyof typeof navItems] || navItems.STUDENT;

  const isOnboarded = user?.bio === "" && user.experience === "" && user.hourlyRate  === "";
console.log(isOnboarded);


  

  return (
    <div className="min-h-screen bg-background flex">

{!isOnboarded && <TutorOnboarding/>}

      <aside className={`${collapsed ? 'hidden' : 'w-64'} fixed left-0 top-0 bottom-0 bg-card border-r border-border flex flex-col transition-all duration-300 z-40 shadow-sm`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-sm">LZ</span>
              </div>
              <span className="text-sm font-bold text-foreground tracking-tight">Learnzilla</span>
            </Link>
          )}
        
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {activeNavItems?.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isSubmenuOpen = openSubmenu === item.label;
            const isParentActive = pathname.startsWith(item.href);

            return (
              <div key={item.label} className="space-y-1">
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isParentActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${isParentActive ? 'text-primary' : ''}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      pathname === item.href ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )}

                <AnimatePresence>
                  {hasSubmenu && isSubmenuOpen && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-1 bg-muted/30 rounded-lg p-1">
                        {item.submenu?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                isSubActive ? 'text-primary bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      <div className={`flex-1 ${collapsed ? 'ml-0' : 'ml-64'} transition-all duration-300`}>
        <header className="h-16 border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/80 backdrop-blur-md z-30 shadow-sm">
       
          <div className="flex gap-x-4">

          { <Button variant={"link"} className="cursor-pointer p-4" onClick={()=>{
          setCollapsed(!collapsed)
         }}>
          <Menu/>
         </Button>}
           <div>
           <h1 className="text-lg font-bold text-foreground tracking-tight">{title}</h1>
           <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{subtitle}</p>
           </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all relative border border-border/50">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-destructive border-2 border-background" />
            </button>
            <ProfilePopup userName={user?.name!} userRole={user?.name} avatarInitials={initials!} />
          </div>
        </header>

        <main className="p-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
