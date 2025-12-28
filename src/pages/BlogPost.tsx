import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Calendar, User, Heart, MessageSquare, Send, Tag, Share2, Shield, Activity, Lock } from "lucide-react";
import { BlogPost, Comment } from "@/data/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TerminalComments from "@/components/TerminalComments";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "sonner";

const BlogPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const contentRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useSEO(post?.title || "Loading Log...", post?.excerpt);

    useEffect(() => {
        window.scrollTo(0, 0);
        const user = localStorage.getItem("genesis_user");
        if (user) setCurrentUser(JSON.parse(user));

        const savedPosts = localStorage.getItem("blog_posts");
        if (savedPosts) {
            const posts: BlogPost[] = JSON.parse(savedPosts);
            setAllPosts(posts);
            const foundPost = posts.find(p => p.id === id);
            if (foundPost) {
                setPost(foundPost);
            } else {
                navigate("/blog");
            }
        }
    }, [id, navigate]);

    const handleGoogleLogin = () => {
        const mockUser = {
            name: "Commander Citizen",
            email: "citizen@genesis.meta",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=genesis",
            id: "u" + Date.now()
        };
        localStorage.setItem("genesis_user", JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        toast.success("BIOMETRIC SCAN COMPLETE: IDENTITY SYNCHRONIZED.");
    };

    const handleLike = () => {
        if (!post || hasLiked) return;
        setHasLiked(true);

        const updatedPosts = allPosts.map(p =>
            p.id === id ? { ...p, likes: p.likes + 1 } : p
        );
        localStorage.setItem("blog_posts", JSON.stringify(updatedPosts));
        setPost({ ...post, likes: post.likes + 1 });
        setAllPosts(updatedPosts);
        toast.success("CORE FREQUENCY TUNED: LIKE REGISTERED.");
    };

    const onAddComment = (text: string) => {
        if (!post || !currentUser) return;
        const comment: Comment = {
            id: "c" + Date.now(),
            user: currentUser.name,
            text: text,
            date: new Date().toLocaleDateString()
        };

        const updatedPosts = allPosts.map(p =>
            p.id === id ? { ...p, comments: [...p.comments, comment] } : p
        );
        localStorage.setItem("blog_posts", JSON.stringify(updatedPosts));
        setPost({ ...post, comments: [...post.comments, comment] });
        setAllPosts(updatedPosts);
        toast.success("DATA BLOCK COMMITTED TO MAIN FEED.");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post?.title,
                    text: post?.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                navigator.clipboard.writeText(window.location.href);
                toast.info("Genesis coordinates copied to clipboard!");
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.info("Genesis coordinates copied to clipboard!");
        }
    };

    if (!post) return null;

    const otherPosts = allPosts.filter(p => p.id !== id).slice(0, 3);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
            <Navbar />

            {/* Elite Reading Progress */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500 z-[70] origin-left shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                style={{ scaleX }}
            />

            <main className="pt-40 pb-32 relative overflow-hidden">
                {/* Background Textures */}
                <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
                    <div className="absolute top-[20%] -right-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[20%] -left-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="max-w-5xl mx-auto px-6 lg:px-12">
                    {/* Navigation Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 flex items-center justify-between"
                    >
                        <Link
                            to="/blog"
                            className="group flex items-center gap-3 text-gray-500 hover:text-emerald-400 transition-all font-black uppercase tracking-[0.4em] text-[11px]"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> BACK TO MISSION CONTROL
                        </Link>
                        <div className="flex items-center gap-6">
                            <button onClick={handleShare} className="text-gray-500 hover:text-white transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button onClick={handleLike} className={`${hasLiked ? 'text-emerald-500' : 'text-gray-500'} hover:text-emerald-400 transition-colors`}>
                                <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Elite Header Section */}
                    <div className="space-y-10 text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-3xl"
                        >
                            <Activity className="w-4 h-4" /> SECTOR: {post.category.toUpperCase()}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-6xl md:text-8xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                        >
                            {post.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center justify-center gap-8 text-[11px] font-bold text-gray-600 uppercase tracking-[0.4em]"
                        >
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500/50" /> {post.date}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                            <span className="flex items-center gap-2"><User className="w-4 h-4 text-emerald-500/50" /> {post.author}</span>
                        </motion.div>
                    </div>

                    {/* Cinematic Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="relative h-[60vh] rounded-[3.5rem] overflow-hidden mb-32 group border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                    >
                        <motion.img
                            src={post.image}
                            alt={post.title}
                            style={{ scale: 1.1 }}
                            className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                            <div className="space-y-2">
                                <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.5em]">MISSION LOG STATUS</p>
                                <h3 className="text-white text-3xl font-black tracking-tighter">DECRYPTED & VERIFIED</h3>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20">
                                <Lock className="w-8 h-8 text-emerald-500" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Highly Aesthetic Content Body */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-20 mb-32">
                        <article className="prose prose-invert max-w-none">
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-4xl text-white font-medium leading-[1.3] mb-20 tracking-tight border-l-4 border-emerald-500 pl-10"
                            >
                                {post.excerpt}
                            </motion.p>

                            <div className="space-y-12 text-gray-400 text-2xl leading-relaxed font-medium">
                                {post.content.split('\n').map((p, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                    >
                                        {p}
                                    </motion.p>
                                ))}
                            </div>
                        </article>

                        {/* Side Controls/Info */}
                        <aside className="space-y-16 hidden lg:block">
                            <div className="space-y-6 sticky top-40">
                                <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl space-y-8">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Share Transmission</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button onClick={handleShare} className="p-3 bg-white/5 rounded-xl hover:bg-emerald-500/20 transition-all flex items-center justify-center">
                                                <Share2 className="w-5 h-5" />
                                            </button>
                                            <button className="p-3 bg-white/5 rounded-xl hover:bg-emerald-500/20 transition-all flex items-center justify-center">
                                                <Send className="w-5 h-5" />
                                            </button>
                                            <Link to="https://github.com/thanan757" target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-emerald-500/20 transition-all flex items-center justify-center">
                                                <Activity className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Tags Identified</p>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase text-gray-500">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-3xl text-center space-y-4">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">RESIDENT EXPERT</p>
                                    <div className="w-16 h-16 rounded-2xl bg-black mx-auto border border-emerald-500/30 overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ananth" alt="Ananth" />
                                    </div>
                                    <p className="text-white text-xs font-black">ANANTH N</p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Elite More Posts Section */}
                    {otherPosts.length > 0 && (
                        <div className="pt-32 border-t border-white/5 mb-32">
                            <div className="flex items-center justify-between mb-16">
                                <h2 className="text-5xl font-black tracking-tighter">More to <span className="text-emerald-500">Explore</span></h2>
                                <Link to="/blog" className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 hover:text-white transition-all">VIEW ALL LOGS →</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {otherPosts.map(p => (
                                    <Link key={p.id} to={`/blog/${p.id}`} className="group block space-y-6">
                                        <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white/10 relative">
                                            <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.title} />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                                        </div>
                                        <div className="space-y-2 px-4">
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{p.category}</p>
                                            <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors line-clamp-2">{p.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Terminal Comments HUD */}
                    <div className="pt-32 border-t border-white/5">
                        <div className="flex items-center justify-between mb-16">
                            <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Mission Feedback</h3>
                            <div className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black text-emerald-500 uppercase tracking-widest">
                                {post.comments.length} CHANNELS SYNCED
                            </div>
                        </div>

                        <TerminalComments
                            comments={post.comments}
                            onAddComment={onAddComment}
                            currentUser={currentUser}
                            onLogin={handleGoogleLogin}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPostPage;
