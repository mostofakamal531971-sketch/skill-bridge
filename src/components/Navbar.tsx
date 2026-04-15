"use client"
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/toggleTheme";
import { categories } from "@/lib/mock-data";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Tutors", href: "/tutors" },
  { label: "Categories", href: "/categories", mega: true },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-strong shadow-lg shadow-background/50" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <span className="text-primary-foreground font-bold text-sm">SB</span>
            </div>
            <span className="text-lg font-bold text-foreground">Learnzilla</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative" onMouseEnter={() => link.mega && setMegaOpen(true)} onMouseLeave={() => link.mega && setMegaOpen(false)}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {link.label}
                  {link.mega && <ChevronDown className="w-3 h-3" />}
                </Link>
                {link.mega && (
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] glass-strong rounded-2xl p-6 grid grid-cols-2 gap-3"
                      >
                        {categories.map((cat) => (
                          <Link key={cat.name} href={`/categories?category=${cat.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                            <span className="text-2xl">{cat.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-foreground">{cat.name}</p>
                              <p className="text-xs text-muted-foreground">{cat.count} tutors</p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90 glow-primary">Get Started</Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button className="text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="lg:hidden overflow-hidden glass-strong">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50">
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <Link href="/login"><Button variant="ghost" className="w-full">Sign In</Button></Link>
                <Link href="/register"><Button className="w-full bg-primary">Get Started</Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

