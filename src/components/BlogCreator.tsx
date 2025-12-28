import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Image as ImageIcon, Tag, Send, CheckCircle, Terminal, Cpu } from "lucide-react";
import { BlogPost } from "@/data/blogPosts";
import { toast } from "sonner";
import { requestNotificationPermission, sendNotification } from "@/utils/notifications";

const BlogCreator = ({ onPost }: { onPost: (post: BlogPost) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTerminalMode, setIsTerminalMode] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Technology",
        image: "",
        tags: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast.error("DATA MISSING: CRITICAL FIELDS REQUIRED.");
            return;
        }

        const newPost: BlogPost = {
            id: Date.now().toString(),
            title: formData.title,
            excerpt: formData.excerpt || formData.content.substring(0, 100) + "...",
            content: formData.content,
            author: "Ananth N",
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            image: formData.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800",
            category: formData.category,
            likes: 0,
            comments: [],
            tags: formData.tags.split(",").map(t => t.trim()).filter(t => t)
        };

        onPost(newPost);
        setIsOpen(false);
        setIsTerminalMode(false);
        toast.success("GENESIS LOG DEPLOYED SUCCESSFULLY.");

        // Send browser notification
        sendNotification(`New Log Decrypted: ${newPost.title}`, {
            body: newPost.excerpt,
            icon: "/favicon.ico"
        });
    };

    return (
        <div className="relative mb-24 flex justify-center">
            {!isOpen ? (
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(16,185,129,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-4 px-12 py-6 bg-emerald-500 text-black font-black text-2xl rounded-3xl transition-all"
                >
                    <Cpu className="w-8 h-8 animate-pulse" />
                    GENERATE NEW LOG
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-4xl bg-black border border-emerald-500/20 rounded-[3rem] p-12 shadow-[0_0_100px_rgba(16,185,129,0.05)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
                            <Terminal className="text-emerald-500 w-10 h-10" />
                            Command Center
                        </h2>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setIsTerminalMode(!isTerminalMode)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isTerminalMode ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                            >
                                Terminal Mode
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-white transition-colors">
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {isTerminalMode ? (
                            <div className="bg-[#050505] border border-emerald-500/20 rounded-3xl p-8 font-mono text-emerald-500/80 space-y-6 min-h-[400px]">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-600">$</span>
                                    <input
                                        className="bg-transparent border-none focus:ring-0 p-0 text-emerald-400 placeholder:text-emerald-900 flex-1"
                                        placeholder="Set title 'My New Genesis Journey'..."
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-gray-600">Enter log content (multi-line):</p>
                                    <textarea
                                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-emerald-400 placeholder:text-emerald-900 resize-none h-[250px]"
                                        placeholder="Initiating log sequence..."
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Log Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold placeholder:text-gray-800"
                                            placeholder="Mission name..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Data Sector</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                                        >
                                            <option className="bg-[#050505]">Technology</option>
                                            <option className="bg-[#050505]">Design</option>
                                            <option className="bg-[#050505]">Education</option>
                                            <option className="bg-[#050505]">AI/ML</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Visual Source (URL)</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-8 py-5 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Main Transmission</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium leading-relaxed"
                                        placeholder="Architectural breakdown..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Transmission Tags</label>
                                    <div className="relative">
                                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-8 py-5 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold placeholder:text-gray-800"
                                            placeholder="AI, Code, Genesis"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-6 bg-emerald-500 text-black font-black text-xl rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-emerald-500/10"
                        >
                            <Send className="w-6 h-6" />
                            FINALIZE TRANS-MISSION
                        </motion.button>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default BlogCreator;
