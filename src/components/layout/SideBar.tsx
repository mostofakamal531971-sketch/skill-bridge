"use client"
import {
  Calendar,
  GraduationCap,
  History,
  Layout,
  LayoutGrid,
  LogOut,
  Search,
  Shapes,
  Shield,
  Star,
  Timer,
  User,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const studentItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutGrid },
  { title: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Security", href: "/dashboard/security", icon: Shield },
]

const tutorItems = [
  { title: "Overview", href: "/tutor/dashboard", icon: LayoutGrid },
  { title: "My Sessions", href: "/tutor/dashboard/sessions", icon: GraduationCap },
  { title: "Availability", href: "/tutor/dashboard/availability", icon: Timer },
  { title: "My Reviews", href: "/tutor/dashboard/my-reviews", icon: Star },
  { title: "Profile", href: "/tutor/dashboard/profile", icon: User },
]

const adminItems = [
  { title: "Admin Overview", href: "/admin", icon: Layout },
  { title: "Manage Bookings", href: "/admin/bookings", icon: History },
  { title: "Categories", href: "/admin/categories", icon: Shapes },
  { title: "Users List", href: "/admin/users", icon: Users },
  { title: "Analytics", href: "/admin", icon: Star },
]

// --- Common Items ---
const commonItems = [
  { title: "Explore Tutors", href: "/tutors", icon: Search }
]

export function DashboardSidebar({userRole}:{userRole:"ADMIN" | "STUDENT" | "TUTOR"}) {
  const pathname = usePathname()

  const sidebarLinks = {
    "ADMIN":adminItems,
    "STUDENT":studentItems,
    "TUTOR":tutorItems,
  }
const isActive = (href: string) => {
    if (pathname === href) return true;
    
    // Check if the current pathname is a sub-route of the link, 
    // but only if the link isn't the root dashboard itself.
    const isRootPath = ["/dashboard", "/tutor/dashboard", "/admin"].includes(href);
    return !isRootPath && pathname.startsWith(href + "/");
  };

  const handleLogout = () => {
// handle logout logic
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="top-16 hidden h-[calc(100vh-64px)] border-r border-border lg:block"
    >
      <SidebarContent className="bg-background text-foreground">
  
        <SidebarGroup className="px-4 py-2">
          <SidebarGroupLabel className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {userRole} Dashboard
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1.5">
            {sidebarLinks[userRole].map((item) => {
              const active = isActive(item.href)

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={cn(
                      "relative flex items-center gap-3 rounded-md px-3 py-5 transition-all",
                      "hover:bg-muted hover:text-foreground",
                      active &&
                        "bg-muted text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    )}
                  >
                    <Link href={item.href}>
                      {active && (
                        <span className="absolute left-0 h-5 w-1 rounded-full bg-primary" />
                      )}
                      <item.icon className="h-[18px] w-[18px]" />
                      <span className="text-sm font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup className="px-4">
          <SidebarGroupLabel className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Settings
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1.5">
            {commonItems.map((item) => {
              const active = isActive(item.href)

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-5 transition-all",
                      "hover:bg-muted hover:text-foreground",
                      active && "bg-muted text-foreground"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-[20px] w-[18px]" />
                      <span className="text-sm font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

