import Link from "next/link";


const links = {
  Platform: [
    { label: "Find Tutors", href: "/tutors" },
    { label: "Become a Tutor", href: "/register" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/tutors" },
  ],
  Support: [
    { label: "Help Center", href: "/contact" },
    { label: "Contact Us", href: "/contact" },
    { label: "Community", href: "/about" },
    { label: "FAQ", href: "/#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/terms" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/terms" },
    { label: "Accessibility", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">LZ</span>
              </div>
              <span className="text-lg font-bold">Learnzilla</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Connecting learners with world-class tutors for personalized, effective education experiences.
            </p>
            <div className="flex gap-3">
              {["X", "In", "Fb", "YT"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Learnzilla. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with ❤️ for learners worldwide</p>
        </div>
      </div>
    </footer>
  );
}

