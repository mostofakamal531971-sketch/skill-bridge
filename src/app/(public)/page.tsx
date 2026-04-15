"use client"
import { motion, AnimatePresence } from "framer-motion";

import { Search, ArrowRight, Star, ChevronDown, BookOpen, Users, Award, Clock, Shield, Video, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { tutors, categories, testimonials, stats, blogPosts, faqs } from "@/lib/mock-data";
import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import ChatWidget from "@/components/global/ChatWidget";
import { Navbar } from "@/components/Navbar";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-16 noise-bg grid-bg overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/5 blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="content-backdrop">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-6">
              <Sparkles className="w-4 h-4 text-primary" /> Trusted by 50,000+ students worldwide
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-6">
              Learn From The{" "}
              <span className="text-gradient">Best Tutors</span>{" "}
              Anywhere
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-8 max-w-lg">
              Connect with expert tutors for personalized 1-on-1 sessions. Master any subject with interactive, engaging lessons tailored to your pace.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search subjects, tutors..." className="pl-12 h-12 glass text-foreground placeholder:text-muted-foreground rounded-xl" />
              </div>
              <Link href="/tutors">
                <Button size="lg" className="h-12 px-6 bg-primary hover:bg-primary/90 glow-primary rounded-xl">
                  Explore <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["SC", "JM", "PS", "AH"].map((initials, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-semibold text-muted-foreground">
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-warning text-warning" />)}
                  <span className="text-sm font-semibold ml-1">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">From 10,000+ reviews</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Dr. Sarah Chen", subject: "Mathematics", rating: "4.9", online: true },
                { name: "James Mitchell", subject: "Physics", rating: "4.8", online: true },
                { name: "Priya Sharma", subject: "CS", rating: "4.9", online: false },
                { name: "Ahmed Hassan", subject: "Biology", rating: "4.9", online: true },
              ].map((t, i) => (
                <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }} className="bento-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary ${t.online ? 'status-online' : ''}`}>
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-warning text-warning" />
                    <span className="text-xs font-medium">{t.rating}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}

function StatsSection() {
  const items = [
    { icon: Users, label: "Expert Tutors", value: `${(stats.tutors / 1000).toFixed(1)}k+` },
    { icon: BookOpen, label: "Students Globally", value: `${(stats.students / 1000)}k+` },
    { icon: Award, label: "Sessions Completed", value: `${(stats.sessions / 1000)}k+` },
    { icon: Star, label: "Satisfaction Rate", value: `${stats.satisfaction}%` },
  ];
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="bento-card text-center group" whileHover={{ y: -4 }}>
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-black text-foreground mb-1">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Explore by <span className="text-gradient">Category</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Browse our curated categories and find the perfect tutor for any subject</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4, scale: 1.02 }}>
                <Link href={`/categories?category=${cat.id}`} className="bento-card flex flex-col items-center text-center py-8 group cursor-pointer">
                  <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <h3 className="font-semibold text-foreground mb-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count}+ tutors</p>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/categories">
              <Button variant="ghost" className="text-primary hover:text-primary/80">View All Categories <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedTutors() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black mb-2">Featured <span className="text-gradient">Tutors</span></h2>
              <p className="text-muted-foreground">Hand-picked experts with outstanding track records</p>
            </div>
            <Link href="/tutors">
              <Button variant="ghost" className="text-primary hover:text-primary/80">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutors.slice(0, 4).map((tutor, i) => (
              <motion.div key={tutor.id} variants={fadeUp} whileHover={{ y: -6 }}>
                <Link href={`/tutors/${tutor.id}`} className="bento-card group block">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-lg font-bold text-primary ${tutor.online ? 'status-online' : ''}`}>
                      {tutor.image}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tutor.name}</h3>
                      <p className="text-sm text-muted-foreground">{tutor.subject}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tutor.bio}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="text-sm font-semibold">{tutor.rating}</span>
                      <span className="text-xs text-muted-foreground">({tutor.reviews})</span>
                    </div>
                    <span className="text-sm font-bold text-primary">${tutor.rate}/hr</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: "Find Your Tutor", desc: "Browse profiles, read reviews, and filter by subject, price, and availability." },
    { icon: Clock, title: "Book a Session", desc: "Choose a convenient time slot and book instantly with our secure payment system." },
    { icon: Video, title: "Start Learning", desc: "Join your live session with HD video, screen sharing, and interactive whiteboards." },
    { icon: Award, title: "Track Progress", desc: "Monitor your improvement with detailed analytics and personalized learning paths." },
  ];
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">How <span className="text-gradient">Learnzilla</span> Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Get started in minutes with our simple 4-step process</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="absolute top-8 left-[60%] right-0 h-px bg-border hidden lg:block" style={{ display: i === 3 ? 'none' : undefined }} />
                <span className="text-xs font-bold text-primary mb-2 block">STEP {i + 1}</span>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: Shield, title: "Verified Experts", desc: "Every tutor is thoroughly vetted with background checks and credential verification." },
    { icon: Video, title: "HD Video Sessions", desc: "Crystal-clear video with screen sharing, whiteboards, and session recording." },
    { icon: Clock, title: "Instant Booking", desc: "Book sessions 24/7 with real-time availability and instant confirmation." },
    { icon: Award, title: "Satisfaction Guaranteed", desc: "100% money-back guarantee if you're not satisfied with your session." },
    { icon: BookOpen, title: "200+ Subjects", desc: "From academics to arts, find expert tutors for virtually any subject." },
    { icon: Users, title: "Community Support", desc: "Join study groups, forums, and get peer support alongside tutoring." },
  ];
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Why Choose <span className="text-gradient">Learnzilla</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Features designed to make your learning experience exceptional</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }} className="bento-card group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">What Students <span className="text-gradient">Say</span></h2>
            <p className="text-muted-foreground">Real stories from real learners</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }} className="bento-card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BlogSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black mb-2">Latest from the <span className="text-gradient">Blog</span></h2>
              <p className="text-muted-foreground">Tips, insights, and news from the world of online learning</p>
            </div>
            <Link href="/blog"><Button variant="ghost" className="text-primary">View All <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}>
                <Link href={`/blog/${post.slug}`} className="bento-card group block">
                  <div className="h-40 rounded-xl bg-muted mb-4 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <span className="text-xs font-semibold text-primary">{post.category}</span>
                  <h3 className="font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground mt-3">{post.date}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Frequently Asked <span className="text-gradient">Questions</span></h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className="bento-card cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground pr-4">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {open === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-sm text-muted-foreground mt-3 overflow-hidden">
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bento-card text-center py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="relative z-10">
            <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4">Start Your Learning Journey Today</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join thousands of students and get exclusive access to top tutors, resources, and special offers.</p>
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="h-12 glass rounded-xl" />
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 glow-primary rounded-xl whitespace-nowrap">Subscribe</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background">

      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedTutors />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <BlogSection />
      <FAQSection />
      <NewsletterSection />

      <ChatWidget />
    </div>
  );
};

export default Index;

