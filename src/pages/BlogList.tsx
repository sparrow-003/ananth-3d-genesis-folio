import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Rocket } from "lucide-react";
import { initialBlogPosts, BlogPost } from "@/data/blogPosts";
import BlogCard from "@/components/BlogCard";
import BlogCreator from "@/components/BlogCreator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { requestNotificationPermission } from "@/utils/notifications";
import { toast } from "sonner";

const BlogList = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [searchParams] = useSearchParams();
    const isAdminMode = searchParams.get("admin") === "true";
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentUser, setCurrentUser] = useState<any>(null);

    useSEO("Genesis Insights", "Explore the latest architectural logs and digital insights from Ananth N.");

    useEffect(() => {
        requestNotificationPermission();

        // Sync user
        const savedUser = localStorage.getItem("genesis_user");
        if (savedUser) setCurrentUser(JSON.parse(savedUser));

        // Sync with localStorage for "live" persistence
        const savedPosts = localStorage.getItem("blog_posts");
        if (savedPosts) {
            setPosts(JSON.parse(savedPosts));
        } else {
            setPosts(initialBlogPosts);
            localStorage.setItem("blog_posts", JSON.stringify(initialBlogPosts));
        }
    }, []);

    const handleGoogleLogin = (asAdmin: boolean = false) => {
        const mockUser = asAdmin ? {
            name: "Ananth N",
            email: "thanan757@gmail.com",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananth",
            id: "admin_001",
            role: "ADMIN"
        } : {
            name: "Commander Citizen",
            email: "citizen@genesis.meta",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=genesis",
            id: "u" + Date.now(),
            role: "USER"
        };
        localStorage.setItem("genesis_user", JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        toast.success(`BIOMETRIC SCAN COMPLETE: WELCOME ${mockUser.name.toUpperCase()}.`);
    };

    const handleLogout = () => {
        localStorage.removeItem("genesis_user");
        setCurrentUser(null);
        toast.info("IDENTITY DE-SYNCHRONIZED.");
    };

    const handleNewPost = (newPost: BlogPost) => {
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem("blog_posts", JSON.stringify(updatedPosts));

        // Simulate Web Notification for subscribers
        if (Notification.permission === "granted") {
            new Notification("New Genesis Log Active!", {
                body: newPost.title,
                icon: "/favicon.ico"
            });
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = activeCategory === "All" || post.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ["All", "Technology", "Design", "Development", "AI/ML"];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />

            <main className="pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
                {/* Auth Status Bar */}
                <div className="flex justify-end mb-8">
                    {!currentUser ? (
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleGoogleLogin(false)}
                                className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
                            >
                                Identify as Visitor
                            </button>
                            {isAdminMode && (
                                <button
                                    onClick={() => handleGoogleLogin(true)}
                                    className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                >
                                    Admin Authorization
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-6 py-2 rounded-2xl">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-white leading-none">{currentUser.name.toUpperCase()}</span>
                                <span className="text-[8px] font-bold text-emerald-500/50 tracking-widest uppercase">{currentUser.role || 'CITIZEN'}</span>
                            </div>
                            <img src={currentUser.image} className="w-8 h-8 rounded-lg border border-white/10" alt="avatar" />
                            <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 transition-colors">
                                <Search className="w-4 h-4 rotate-45" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Cinematic Header */}
                <div className="text-center mb-24 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-black uppercase tracking-widest"
                    >
                        <Rocket className="w-4 h-4" /> The Digital Logbook
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter"
                    >
                        Genesis <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Insights</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-gray-500 text-xl font-medium leading-relaxed"
                    >
                        Deep dives into architectural patterns, future technologies,
                        and the evolution of the digital frontier.
                    </motion.p>
                </div>

                {/* Admin Creator - ONLY for Ananth N */}
                {currentUser?.role === "ADMIN" && <BlogCreator onPost={handleNewPost} />}

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-3xl">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search logs by keyword or tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 pl-16 pr-6 py-4 text-white font-bold"
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pr-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-emerald-500 text-black' : 'hover:bg-white/5 text-gray-500'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredPosts.length === 0 && (
                    <div className="py-40 text-center">
                        <h3 className="text-2xl font-black text-gray-700 uppercase tracking-widest">No logs found in current sector.</h3>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BlogList;
