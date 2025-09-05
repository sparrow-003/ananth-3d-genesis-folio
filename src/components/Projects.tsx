import { motion, useMotionValue, useTransform, useScroll, useSpring, useInView } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";
import { Code, BrainCircuit, Layers } from "lucide-react";

// Project data, simplified for a focused 3-project showcase
const projectsData = [
  {
    id: 1,
    title: "AI-Powered Social Network",
    description: "A developer-first social network with AI-driven collaboration tools, real-time communication, and code sharing features.",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Framer Motion"],
    features: ["AI matchmaking for dev collaboration", "Real-time chat & code snippets", "Team project management", "Interactive event boards"],
    icon: <Code className="w-6 h-6 text-yellow-300" />,
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2697&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Naan Mudhalvan - AI & BI Programs",
    description: "An educational platform for over 150 students, featuring interactive labs, data analytics, and AI-powered learning feedback.",
    technologies: ["Python", "Jupyter", "TensorFlow", "FastAPI", "Pandas", "Plotly"],
    features: ["Live coding modules", "Student progress analytics", "AI-driven auto-grading", "Customizable dashboards"],
    icon: <BrainCircuit className="w-6 h-6 text-purple-300" />,
    image: "https://images.unsplash.com/photo-1549646467-3a1b37b6ed41?q=80&w=2752&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Intelligent AI ChatBot Framework",
    description: "A context-aware, modular chatbot framework with multilingual NLU, streaming responses, and an emotion-aware engine.",
    technologies: ["Python", "Transformers", "React", "WebSocket", "Redis", "FastAPI"],
    features: ["Multilingual intent recognition", "Conversation memory graph", "Emotion-aware actions", "Pluggable domain knowledge"],
    icon: <Layers className="w-6 h-6 text-cyan-300" />,
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2697&auto=format&fit=crop"
  }
];

// 3D Parallax Tilt Card Component
const ParallaxCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [20, -20]);
  const rotateY = useTransform(x, [-100, 100], [-20, 20]);
  const gradientTransform = useTransform(x, [-100, 100], ["-20%", "120%"]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { offsetWidth, offsetHeight } = ref.current;
    const { clientX, clientY } = event;
    const { left, top } = ref.current.getBoundingClientRect();
    const xVal = clientX - left - offsetWidth / 2;
    const yVal = clientY - top - offsetHeight / 2;
    x.set(xVal);
    y.set(yVal);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        cursor: "pointer"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl p-1 will-change-transform ${className}`}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glare effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--x) var(--y), rgba(255, 255, 255, 0.2), transparent 40%)`,
          '--x': useTransform(x, (val) => `${val + 50}%`),
          '--y': useTransform(y, (val) => `${val + 50}%`),
          '--gx': useTransform(x, (val) => `${val}px`),
          '--gy': useTransform(y, (val) => `${val}px`),
        }}
        whileHover={{ opacity: 1 }}
      />
      {children}
    </motion.div>
  );
};

// Main Projects component
const ProjectsShowcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeProject, setActiveProject] = useState(projectsData[0]);
  
  // Parallax scroll for background elements
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const springYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgTranslateY = useTransform(springYProgress, [0, 1], ["-10%", "10%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="projects" ref={ref} className="relative py-24 bg-[#0A0A0A] text-gray-100 overflow-hidden">
      
      {/* Background - Rich and Classic Feel */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Top left gold glow */}
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-96 h-96 rounded-full blur-[120px] bg-gradient-to-br from-[#9b8359] to-transparent opacity-30"
          style={{ translateY: bgTranslateY }}
        />
        {/* Bottom right dark purple glow */}
        <motion.div
          className="absolute -bottom-[10%] -right-[10%] w-96 h-96 rounded-full blur-[120px] bg-gradient-to-br from-purple-900 to-transparent opacity-20"
          style={{ translateY: useTransform(springYProgress, [0, 1], ["10%", "-10%"]) }}
        />
        {/* Elegant grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]" />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-200 to-amber-300">
            Showcase of Work
          </h2>
          <motion.p
            className="mt-4 text-xl font-light italic text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A collection of my most significant projects, crafted with a passion for classic design and modern technology.
          </motion.p>
        </motion.div>

        {/* Tabs for project selection */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {projectsData.map((project, index) => (
            <motion.button
              key={project.id}
              variants={itemVariants}
              onClick={() => setActiveProject(project)}
              className={`relative py-2 px-6 rounded-full transition-all duration-300 font-medium ${
                activeProject.id === project.id
                  ? "bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-900 shadow-md shadow-amber-500/30"
                  : "bg-transparent text-gray-400 border border-gray-600/50 hover:border-gray-400/50 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {project.title}
              {activeProject.id === project.id && (
                <motion.span
                  layoutId="bubble"
                  className="absolute inset-0 rounded-full -z-10 bg-gradient-to-r from-amber-500 to-yellow-400"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Active project card */}
        {activeProject && (
          <ParallaxCard className="bg-gradient-to-br from-[#121212]/90 to-[#0A0A0A]/90 border border-amber-600/20 shadow-xl shadow-black/50">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 30, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: 30, rotateX: 10 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Section */}
                <div className="relative min-h-[300px] lg:min-h-[500px]">
                  <motion.img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.1, rotate: -2 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                </div>
                
                {/* Content Section */}
                <div className="p-8 md:p-12 lg:p-16 relative">
                  <motion.div style={{ transform: "translateZ(30px)" }}>
                    <div className="flex items-center gap-4 mb-4">
                      {activeProject.icon}
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-200">
                        {activeProject.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-lg mb-6 font-light">{activeProject.description}</p>

                    <div className="space-y-6">
                      {/* Technologies Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-amber-400 mb-2">TECHNOLOGIES</h4>
                        <div className="flex flex-wrap gap-2">
                          {activeProject.technologies.map((tech, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + i * 0.05 }}
                              className="rounded-full bg-stone-800/50 border border-stone-700/50 px-4 py-1 text-sm text-gray-300"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Features Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-amber-400 mb-2">KEY FEATURES</h4>
                        <ul className="space-y-3">
                          {activeProject.features.map((feature, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + i * 0.05 }}
                              className="flex items-center gap-3 text-gray-300"
                            >
                              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4">
                      <motion.a
                        href="#"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 px-6 py-3 text-stone-950 font-semibold shadow-lg shadow-amber-500/30 transition-all"
                        whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(251, 191, 36, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        View Project
                      </motion.a>
                      <motion.a
                        href="#"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-600 px-6 py-3 text-gray-300 font-semibold hover:border-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 2S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 2 5.09 2A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                        Source Code
                      </motion.a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </ParallaxCard>
        )}
      </div>
    </section>
  );
};

export default ProjectsShowcase;
