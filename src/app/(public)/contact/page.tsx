"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const CONTACT_INFO = [
  { icon: Mail, title: "Email Us", detail: "support@Learnzilla.com", sub: "We reply within 24 hours" },
  { icon: Phone, title: "Call Us", detail: "+1 (555) 123-4567", sub: "Mon-Fri 9am to 6pm EST" },
  { icon: MapPin, title: "Visit Us", detail: "123 Market Street", sub: "San Francisco, CA 94105" },
  { icon: Clock, title: "Working Hours", detail: "Mon - Fri: 9AM - 6PM", sub: "Weekend: 10AM - 4PM" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    toast.success("Message sent successfully! We'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
          <Badge className="mb-6 bg-indigo-500/10 text-indigo-600 border-none font-bold px-4 py-1.5 rounded-full">
            <MessageSquare className="w-3 h-3 mr-1" /> Get In Touch
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            We&apos;d Love to <span className="text-indigo-600">Hear</span> From You
          </h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Have a question, feedback, or want to partner with us? Drop us a message and we&apos;ll get back to you.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-4">
            {CONTACT_INFO.map((item, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <Card className="border-none shadow-sm rounded-[24px] hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-base mb-1">{item.title}</h3>
                      <p className="font-bold text-sm">{item.detail}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div {...fadeInUp} className="lg:col-span-3">
            <Card className="border-none shadow-xl rounded-[32px]">
              <CardContent className="p-8 md:p-10">
                <h2 className="text-2xl font-black mb-2">Send a Message</h2>
                <p className="text-muted-foreground font-medium text-sm mb-8">
                  Fill out the form below and we&apos;ll respond within 24 hours.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Full Name</label>
                      <Input required placeholder="John Doe" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email</label>
                      <Input required type="email" placeholder="john@example.com" className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Subject</label>
                    <Input required placeholder="How can we help you?" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Message</label>
                    <Textarea required placeholder="Tell us more about your inquiry..." className="min-h-[150px] rounded-xl resize-none" />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg"
                  >
                    {isSubmitting ? "Sending..." : (<>Send Message <Send className="ml-2" size={18} /></>)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

