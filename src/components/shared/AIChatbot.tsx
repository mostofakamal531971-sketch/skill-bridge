"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader2, MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const AI_RESPONSES = [
  "Great question! Based on your learning goals, I'd recommend checking out our top-rated tutors in that subject. You can filter by rating and price on the Tutors page.",
  "You can book a session by visiting any tutor's profile and selecting an available time slot. Payment is processed securely at the time of booking.",
  "Our tutors go through a rigorous verification process. We check credentials, conduct teaching demos, and monitor student reviews to ensure quality.",
  "If you need to cancel, you can do so up to 24 hours before the session for a full refund. Just go to your Dashboard > My Bookings.",
  "Absolutely! Learnzilla offers tutoring in programming, mathematics, languages, music, design, business, and many more subjects. Browse our categories to explore!",
  "I'd suggest starting with a trial session — many tutors offer a discounted first meeting. This way you can find the perfect fit for your learning style.",
  "For the best results, I recommend having your goals clearly defined before each session. This helps your tutor prepare and deliver maximum value.",
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "Hi! I'm Learnzilla AI Assistant. How can I help you today? Ask me about tutors, bookings, subjects, or anything else!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1500));

    const aiResponse: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-[360px] max-h-[500px] bg-card border border-border rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-indigo-600 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Learnzilla AI</p>
                  <p className="text-indigo-200 text-[10px] font-medium">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[280px] max-h-[340px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed",
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 h-11 rounded-xl"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                >
                  {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300",
          isOpen
            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            : "bg-indigo-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}

