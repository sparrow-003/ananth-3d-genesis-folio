import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Code2, Users, Bot, ExternalLink, Github, Play, ChevronRight, Layers, Sparkles } from "lucide-react";

const projectsData = [
  {
    id: 1,
    title: "DevMatch",
    subtitle: "Developer Collaboration Platform",
    description: "A sophisticated social network designed exclusively for developers, featuring AI-powered matching algorithms to connect like-minded programmers and facilitate seamless collaboration on innovative projects.",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Socket.io", "AI/ML"],
    features: [
      "AI-powered developer matching algorithm",
      "Real-time collaborative coding environment",
      "Project discovery and team formation",
      "Integrated chat and video calls",
      "Code review and sharing system"
    ],
    category: "Full-Stack Development",
    type: "coding",
    icon: <Code2 className="w-10 h-10" />,
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    glowColor: "rgba(99, 102, 241, 0.5)",
    liveUrl: "https://dev-matchs.vercel.app",
    githubUrl: "https://github.com/sparrow-003/debug-your-heart.git"
  },
  {
    id: 2,
    title: "Naan Mudhalvan",
    subtitle: "AI & BI Education Initiative",
    description: "A comprehensive educational program where I personally mentor and teach 150+ students in Artificial Intelligence and Business Intelligence through hands-on workshops, practical sessions, and real-world project guidance.",
    technologies: ["Python", "Jupyter", "TensorFlow", "Power BI", "Tableau", "Analytics"],
    features: [
      "Live coding sessions with 150+ students",
      "Hands-on AI/BI project workshops",
      "Personalized mentorship programs",
      "Real-world case study implementations",
      "Student progress tracking and assessment"
    ],
    category: "Education & Mentorship",
    type: "physical",
    icon: <Users className="w-10 h-10" />,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    glowColor: "rgba(20, 184, 166, 0.5)",
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 3,
    title: "RAG Chat Bot",
    subtitle: "Smart Document Summarizer",
    description: "An intelligent RAG (Retrieval-Augmented Generation) chatbot that analyzes and summarizes documents with advanced AI capabilities, providing context-aware responses and efficient information extraction.",
    technologies: ["Python", "Transformers", "React", "FastAPI", "RAG", "NLP"],
    features: [
      "Document analysis and summarization",
      "Context-aware conversation management",
      "Multi-format document support",
      "Intelligent information retrieval",
      "Real-time AI-powered responses"
    ],
    category: "AI/ML Development",
    type: "coding",
    icon: <Bot className="w-10 h-10" />,
    gradient: "from-fuchsia-500 via-purple-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.5)",
    liveUrl: "https://v0-smart-document-summarizer.vercel.app",
    githubUrl: "https://github.com/sparrow-003/DOC-.git"
  }
];

const ProjectCard = ({ project, isActive, onClick }: any) => {
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
      className={`relative cursor-pointer group rounded-[2rem] p-[2px] overflow-hidden transition-all duration-500 ${isActive ? 'scale-105 z-10' : 'scale-100 hover:scale-102'
        }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      {/* Animated Border Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`}
      />

      <motion.div
        className="relative bg-[#050505] rounded-[2rem] p-6 h-full flex flex-col backdrop-blur-3xl"
        animate={{
          rotateX: mousePos.y * -15,
          rotateY: mousePos.x * 15,
          z: isActive ? 20 : 0
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2rem]" />

        {/* Glow behind icon */}
        <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-${project.gradient.split('-')[1]}-500/20 to-transparent blur-3xl -z-10`} />

        <div className="flex justify-between items-start mb-6">
          <motion.div
            className={`p-3 rounded-2xl bg-gradient-to-br ${project.gradient} text-white shadow-xl`}
            whileHover={{ rotate: [0, -10, 10, 0] }}
          >
            {project.icon}
          </motion.div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-xl ${project.type === 'coding' ? 'text-blue-400' : 'text-emerald-400'}`}>
            {project.type === 'coding' ? 'Digital Construct' : 'Meta Teaching'}
          </div>
        </div>

        <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
          {project.title}
        </h3>
        <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-[0.2em]">
          {project.subtitle}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.technologies.slice(0, 3).map((tech: any, i: number) => (
            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 font-medium">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 text-[10px] text-gray-600 font-bold">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Hover Arrow */}
        <motion.div
          className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ProjectDetails = ({ project }: any) => {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="relative mt-8 lg:mt-12 bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-2xl shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Visual Showcase Side */}
        <div className="lg:col-span-5 relative p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
          <div className={`absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br ${project.gradient} opacity-20 blur-[100px]`} />
          <div className={`absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br ${project.gradient} opacity-10 blur-[80px]`} />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className={`inline-flex p-4 rounded-3xl mb-8 bg-gradient-to-br ${project.gradient} text-white shadow-[0_0_40px_${project.glowColor}]`}>
                {project.icon}
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter leading-none">
                {project.title}
              </h2>
              <p className="text-xl text-gray-400 mb-8 font-medium leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="space-y-4">
              <motion.a
                href={project.liveUrl}
                className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r ${project.gradient} text-black font-black uppercase text-sm tracking-widest shadow-xl hover:scale-[1.03] active:scale-95 transition-all`}
                whileHover={{ scale: 1.03 }}
                style={{ boxShadow: `0 0 40px ${project.glowColor}` }}
              >
                <Play className="w-5 h-5" />
                Launch Deployment
              </motion.a>

              {project.type === 'coding' && (
                <motion.a
                  href={project.githubUrl}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all"
                >
                  <Github className="w-5 h-5" />
                  Access Source
                </motion.a>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specification Side */}
        <div className="lg:col-span-7 p-8 lg:p-12 bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
            <div>
              <h4 className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm mb-6 opacity-60">
                <Layers className="w-4 h-4 text-emerald-500" />
                Tech Stack Core
              </h4>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-gray-300 backdrop-blur-sm"
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm mb-6 opacity-60">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Mission Directives
              </h4>
              <div className="space-y-4">
                {project.features.map((feature: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r ${project.gradient} shrink-0 shadow-[0_0_10px_white]`} />
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [activeProject, setActiveProject] = useState(projectsData[0]);

  return (
    <section id="projects" ref={containerRef} className="relative py-24 px-4 sm:px-8 overflow-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 bg-black -z-50" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-6">
          <motion.span
            className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.3em]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            Proof of Excellence
          </motion.span>
          <motion.h2
            className="text-6xl md:text-8xl font-black text-white tracking-tighter"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Genesis</span> Lab
          </motion.h2>
          <motion.p
            className="max-w-2xl mx-auto text-gray-500 text-lg font-medium leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            A curated selection of architecture spanning AI engineering,
            full-stack development, and large-scale mentorship systems.
          </motion.p>
        </div>

        {/* Dynamic Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <AnimatePresence mode="popLayout">
            {projectsData.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={activeProject.id === project.id}
                onClick={() => setActiveProject(project)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Expansive Detail View */}
        <AnimatePresence mode="wait">
          <ProjectDetails project={activeProject} />
        </AnimatePresence>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-emerald-500/5 to-transparent -z-20 blur-3xl opacity-50" />
    </section>
  );
};

export default Projects;
