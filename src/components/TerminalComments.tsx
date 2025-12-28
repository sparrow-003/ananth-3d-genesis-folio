import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronRight, Send, User, ShieldCheck } from "lucide-react";
import { Comment } from "@/data/blogPosts";
import { toast } from "sonner";

interface TerminalCommentsProps {
    comments: Comment[];
    onAddComment: (text: string) => void;
    currentUser: any;
    onLogin: () => void;
}

const TerminalComments = ({ comments, onAddComment, currentUser, onLogin }: TerminalCommentsProps) => {
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [comments]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error("SYSTEM ERROR: UNIDENTIFIED USER. PLEASE LOGIN VIA GOOGLE.");
            onLogin();
            return;
        }
        if (!input.trim()) return;
        onAddComment(input);
        setInput("");
    };

    return (
        <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5">
            {/* Terminal Header */}
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/70">Secure Genesis Terminal v2.0</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                </div>
            </div>

            {/* Terminal Viewport */}
            <div
                ref={scrollRef}
                className="h-[400px] overflow-y-auto p-8 font-mono text-sm space-y-6 scrollbar-hide"
            >
                <div className="text-emerald-500/40 text-[10px] uppercase tracking-widest mb-8">
                    [SYSTEM INITIALIZED - READING ARCHIVES...]
                </div>

                <AnimatePresence mode="popLayout">
                    {comments.map((comment, i) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-2 group"
                        >
                            <div className="flex items-center gap-3 opacity-60">
                                <span className="text-emerald-500">[{comment.date}]</span>
                                <span className="text-emerald-400 font-bold uppercase transition-colors group-hover:text-white">{comment.user}</span>
                                <span className="text-white/20">::</span>
                                {comment.user.includes("Ananth") && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                            </div>
                            <div className="pl-6 border-l border-emerald-500/20 text-gray-400 leading-relaxed font-medium">
                                {comment.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {comments.length === 0 && (
                    <div className="text-gray-600 italic">No communication logs found in this sector...</div>
                )}
            </div>

            {/* Input Prompt */}
            <div className="bg-black/50 p-6 border-t border-emerald-500/10">
                {!currentUser ? (
                    <button
                        onClick={onLogin}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                    >
                        <User className="w-4 h-4" /> Initialize Identity via Google
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="flex items-center gap-4">
                        <div className="shrink-0 flex items-center gap-2 text-emerald-500">
                            <ChevronRight className="w-5 h-5 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest">CMD:</span>
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Inject command or message..."
                            className="flex-1 bg-transparent border-none text-emerald-400 placeholder:text-emerald-900 focus:ring-0 font-mono text-sm h-12"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="p-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black rounded-xl transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TerminalComments;
