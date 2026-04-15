"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Award,
  Globe,
  GraduationCap,
  Heart,
  Lightbulb,
  Shield,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const TEAM = [
  { name: "Habibur Rhaman", role: "Founder & CEO", avatar: "https://i.pravatar.cc/200?img=11" },
  { name: "Sarah Chen", role: "Head of Education", avatar: "https://i.pravatar.cc/200?img=5" },
  { name: "Marcus Johnson", role: "Lead Developer", avatar: "https://i.pravatar.cc/200?img=12" },
  { name: "Priya Sharma", role: "Head of Design", avatar: "https://i.pravatar.cc/200?img=9" },
];

const VALUES = [
  { icon: Heart, title: "Student First", desc: "Every decision we make puts our learners at the center." },
  { icon: Shield, title: "Trust & Safety", desc: "We ensure every interaction is secure and verified." },
  { icon: Lightbulb, title: "Innovation", desc: "Constantly pushing boundaries in educational technology." },
  { icon: Globe, title: "Accessibility", desc: "Quality education should be available to everyone, everywhere." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
          <Badge className="mb-6 bg-indigo-500/10 text-indigo-600 border-none font-bold px-4 py-1.5 rounded-full">
            About Learnzilla
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Bridging the Gap Between
            <span className="text-indigo-600"> Learning</span> and
            <span className="text-indigo-600"> Doing</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            We&apos;re on a mission to make personalized education accessible to everyone.
            Founded in 2026, Learnzilla connects ambitious learners with world-class experts.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Tutors", val: "500+" },
            { label: "Students Served", val: "20,000+" },
            { label: "Sessions Completed", val: "100K+" },
            { label: "Countries", val: "45+" },
          ].map((stat, i) => (
            <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl sm:text-4xl font-black text-indigo-600">{stat.val}</p>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 border-none font-bold">
              <Target className="w-3 h-3 mr-1" /> Our Mission
            </Badge>
            <h2 className="text-4xl font-black tracking-tight mb-6">Democratizing Quality Education</h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-6">
              Traditional education doesn&apos;t work for everyone. We believe that personalized,
              1-on-1 learning is the most effective way to master any skill. Learnzilla
              makes this possible by connecting students directly with verified experts
              who are passionate about teaching.
            </p>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Our platform handles everything from scheduling to payments, so both students
              and tutors can focus on what matters most — the learning experience.
            </p>
          </motion.div>
          <motion.div {...fadeInUp} className="relative">
            <div className="aspect-[4/3] rounded-[40px] overflow-hidden border-8 border-card shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30 dark:bg-zinc-950/50 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">Our Core Values</h2>
            <p className="text-muted-foreground font-medium text-lg">The principles that guide everything we do.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[28px] h-full text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <val.icon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-black mb-3">{val.title}</h3>
                    <p className="text-muted-foreground font-medium">{val.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground font-medium text-lg">The people making Learnzilla possible.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TEAM.map((member, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-[30px] overflow-hidden mb-4 border-4 border-card shadow-lg">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-black text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black tracking-tight mb-6">Ready to Start Learning?</h2>
          <p className="text-muted-foreground text-lg font-medium mb-8">
            Join thousands of students who are already transforming their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black h-14 px-10 text-lg">
              <Link href="/sign-up">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl font-bold h-14 px-10 text-lg">
              <Link href="/tutors">Browse Tutors</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

