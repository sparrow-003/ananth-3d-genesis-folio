import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Calendar, ArrowUpRight, Shield } from "lucide-react";
import { BlogPost } from "@/data/blogPosts";

const BlogCard = ({ post }: { post: BlogPost }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="group relative bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-emerald-500/30"
            style={{ perspective: 1000 }}
        >
            <motion.div
                className="relative h-full"
                animate={{
                    rotateX: mousePos.y * -10,
                    rotateY: mousePos.x * 10,
                }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Image Container */}
                <div className="relative h-60 overflow-hidden m-4 rounded-[2rem]">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4">
                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-xl">
                            <Shield className="w-3 h-3" /> {post.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 pt-2">
                    <div className="flex items-center gap-4 text-[10px] text-gray-600 mb-4 font-bold uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-emerald-500" /> {post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span>{post.author}</span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-emerald-400 transition-all duration-300 tracking-tighter">
                        {post.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium line-clamp-2">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-gray-600 group/link">
                                <Heart className="w-4 h-4 transition-colors group-hover/link:text-red-500" />
                                <span className="text-xs font-bold">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs font-bold">{post.comments.length}</span>
                            </div>
                        </div>

                        <Link
                            to={`/blog/${post.id}`}
                            className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] hover:gap-4 transition-all"
                        >
                            ACCESS LOG <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
};

export default BlogCard;
