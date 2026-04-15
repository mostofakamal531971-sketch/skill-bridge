"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { generateAIContent } from "@/services/ai.services";
import { ScrollArea } from "../ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  quickReplies?: string[];
  isThinking?: boolean;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hi! I'm your Learnzilla AI assistant. How can I help you today?",
    },
  ]);
  const [inputStr, setInputStr] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputStr("");
    setIsTyping(true);

    try {
      const res = await generateAIContent({
        mode: "chat",
        data: { user_message: text },
        context: { platform: "Learnzilla Tutoring Platform" },
      });

      setIsTyping(false);

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: res.data.answer,
            quickReplies: res.data.quick_replies || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "Sorry, I am having trouble connecting right now. Please try again later.",
          },
        ]);
      }
    } catch (e) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "Sorry, an unexpected error occurred.",
        },
      ]);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 shadow-2xl rounded-2xl overflow-hidden origin-bottom-right"
          >
            <Card className="w-[350px] sm:w-[400px] border-none flex flex-col h-[500px]">
              <CardHeader className="p-4 bg-indigo-600 text-white flex flex-row items-center justify-between space-y-0 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles size={16} className="text-indigo-100" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Learnzilla AI</h3>
                    <p className="text-[10px] text-indigo-200">Usually responds instantly</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <ChevronDown size={18} />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 p-4 overflow-y-auto bg-muted/30" ref={scrollRef}>
                <div className="flex flex-col gap-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {m.role === "ai" && (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                          <Bot size={16} className="text-indigo-600 dark:text-indigo-300" />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 max-w-[80%]">
                        <div
                          className={`p-3 text-sm rounded-2xl ${
                            m.role === "user"
                              ? "bg-indigo-600 text-white rounded-br-sm"
                              : "bg-card border border-border text-foreground rounded-bl-sm shadow-sm"
                          }`}
                        >
                          {m.content}
                        </div>
                        
                        {m.quickReplies && m.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {m.quickReplies.map((qr, i) => (
                              <button
                                key={i}
                                onClick={() => handleQuickReply(qr)}
                                className="text-[10px] px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full border border-indigo-200 dark:border-indigo-500/30 transition-colors text-left"
                              >
                                {qr}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {m.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                          <User size={16} className="text-zinc-600 dark:text-zinc-400" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-end gap-2 justify-start">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                        <Bot size={16} className="text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div className="p-4 bg-card border border-border rounded-2xl rounded-bl-sm flex gap-1">
                        <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                        <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                        <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-3 bg-card border-t border-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(inputStr);
                  }}
                  className="flex w-full items-center gap-2"
                >
                  <Input
                    placeholder="Ask me anything..."
                    className="flex-1 rounded-full bg-muted/50 border-none focus-visible:ring-1"
                    value={inputStr}
                    onChange={(e) => setInputStr(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputStr.trim() || isTyping}
                    className="rounded-full bg-indigo-600 hover:bg-indigo-700 h-10 w-10 shrink-0 shadow-md"
                  >
                    <Send size={16} />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 flex items-center justify-center p-0"
            >
              <MessageSquare size={24} className="text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

