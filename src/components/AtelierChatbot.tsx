import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AtelierChatbotProps {
  email: string;
  userName: string;
}

export default function AtelierChatbot({ email, userName }: AtelierChatbotProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "assistant",
      content: `Greetings, ${userName}. I am Matteo, Chief Conservator for the Calvino Torvani atelier. Whether you wish to discuss the protein architecture of fine French calfskin, verify an NFC serial registry, or curate lookbook items for your style profile, I am here to guide you.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested high-end queries
  const suggestedInquiries = [
    "How do I condition English Bridle leather?",
    "Explain the NFC Authenticity Shield.",
    "Bespoke suggestions for my style.",
    "What is the story of Matteo?"
  ];

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build message payload in standard chat format
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          messages: historyPayload
        })
      });

      if (!res.ok) throw new Error("Atelier server busy");

      const data = await res.json();
      
      const assistantMsg: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "I apologize, my attention was momentarily diverted. Our Florentine workshops are currently receiving high volumes. How can I assist you with your leather pieces?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Concierge Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-full sm:w-[400px] h-[550px] bg-white border border-espresso/10 rounded-sm shadow-2xl flex flex-col justify-between overflow-hidden mb-4"
          >
            {/* Elegant Header */}
            <div className="bg-espresso text-alabaster p-4 flex justify-between items-center border-b border-gold-burnished/20">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gold-burnished/15 flex items-center justify-center border border-gold-burnished/30 text-gold-burnished font-serif text-sm font-semibold">
                    M
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-espresso" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs tracking-wider uppercase font-serif font-semibold text-alabaster">Atelier Concierge</h4>
                  <span className="text-[9px] tracking-widest text-gold-burnished uppercase block">Matteo • Chief Conservator</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-alabaster/60 hover:text-gold-burnished transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Thread Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-alabaster/30">
              
              {/* Informative Header card */}
              <div className="bg-white border border-espresso/5 rounded-sm p-3 space-y-1.5 shadow-xs">
                <span className="text-[8px] tracking-widest uppercase font-semibold text-gold-burnished flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Private Atelier Connection
                </span>
                <p className="text-[10px] text-espresso/60 leading-relaxed font-light">
                  Ask me about custom gold monograms, our unique 45-degree English saddler stich, local microclimate leather protection, or the NFC chip verified registry.
                </p>
              </div>

              {/* Message Bubbles */}
              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`max-w-[85%] space-y-1 ${isAssistant ? "text-left" : "text-right"}`}>
                      <div
                        className={`p-3 text-[11px] leading-relaxed font-light rounded-sm ${
                          isAssistant
                            ? "bg-white border border-espresso/5 text-espresso font-serif italic"
                            : "bg-espresso text-alabaster"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="block text-[8px] text-espresso/40 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Chat Loading state */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-espresso/5 rounded-sm p-3 flex items-center gap-2">
                    <span className="text-[10px] text-gold-burnished font-serif italic">Matteo is drafting</span>
                    <span className="flex gap-1">
                      <span className="w-1 h-1 rounded-full bg-gold-burnished animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-gold-burnished animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 rounded-full bg-gold-burnished animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Micro-suggestions area */}
            <div className="p-2 border-t border-espresso/5 bg-white space-y-1.5">
              <span className="text-[8px] tracking-widest uppercase text-espresso/40 font-semibold block px-1">Suggested Inquiries</span>
              <div className="flex flex-wrap gap-1">
                {suggestedInquiries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[9px] bg-alabaster hover:bg-gold-burnished/5 hover:border-gold-burnished/30 border border-espresso/5 text-espresso/70 px-2 py-1 rounded-sm transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleFormSubmit} className="p-3 border-t border-espresso/5 bg-white flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask our Florentine leather master..."
                className="flex-1 bg-alabaster border border-espresso/10 rounded-sm px-3 text-[11px] focus:outline-none focus:border-gold-burnished text-espresso placeholder:text-espresso/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-espresso hover:bg-gold-burnished text-white rounded-sm transition-colors disabled:opacity-40 disabled:hover:bg-espresso flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Brand Concierge Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="bg-espresso text-alabaster border border-gold-burnished/30 shadow-xl rounded-full px-5 py-3.5 flex items-center gap-2.5 group hover:border-gold-burnished transition-all"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-gold-burnished group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <span className="text-[10px] tracking-widest uppercase font-semibold font-sans">
          Atelier Concierge
        </span>
      </motion.button>

    </div>
  );
}
