import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";
import { useInView } from "framer-motion";
import { Code, BrainCircuit, MessageSquare, BarChart3, Github, Play } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  codeSnippet?: string;
  icon: JSX.Element;
}

/**
 * CrystalBlue Background — subtle 3D-feel with animated gradients & light rays
 */
const CrystalBlueBg = () => {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Deep radial glow */}
      <div className="absolute -inset-[20%] opacity-70" style={{
        background:
          "radial-gradient(60% 60% at 50% 10%, rgba(56,189,248,0.18) 0%, transparent 55%)," +
          "radial-gradient(50% 50% at 80% 20%, rgba(99,102,241,0.18) 0%, transparent 60%)," +
          "radial-gradient(40% 40% at 20% 80%, rgba(59,130,246,0.18) 0%, transparent 60%)",
      }} />
      {/* Light shards */}
      <motion.div
        className="absolute -top-24 -right-24 w-[60rem] h-[60rem] rotate-12"
        initial={{ opacity: 0.15, rotate: 8 }}
        animate={{ opacity: 0.3, rotate: 20 }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(59,130,246,0.0), rgba(59,130,246,0.25), rgba(34,211,238,0.15), rgba(99,102,241,0.2), rgba(59,130,246,0.0))",
          filter: "blur(60px)",
          maskImage: "radial-gradient(closest-side, black, transparent)",
        }}
      />
      {/* Floating crystal orbs */}
      {[0,1,2,3,4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-40 h-40 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.35), rgba(34,211,238,0.35))",
            boxShadow:
              "inset 0 1px 8px rgba(255,255,255,0.3), 0 8px 40px rgba(59,130,246,0.25)",
            filter: "blur(1px)",
          }}
          initial={{ x: 120 * i, y: 80 * i, scale: 0.8, opacity: 0.35 }}
          animate={{
            x: [120 * i, 120 * i + 40, 120 * i - 30, 120 * i],
            y: [80 * i, 80 * i - 30, 80 * i + 40, 80 * i],
            scale: [0.85, 1, 0.9, 0.85],
            opacity: [0.25, 0.4, 0.3, 0.25],
          }}
          transition={{ duration: 18 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

/**
 * TiltCard — Lightweight 3D tilt with glare driven by mouse position
 */
const TiltCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const glare = useMotionValue(0.15);

  const rotateX = useTransform(rx, [ -40, 40 ], [ 6, -6 ]);
  const rotateY = useTransform(ry, [ -40, 40 ], [ -8, 8 ]);
  const glareOpacity = useTransform(glare, [0, 1], [0.08, 0.35]);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;
    ry.set((x - halfW) / 4);
    rx.set((y - halfH) / 4);
    glare.set(0.9);
  }
  function onLeave() {
    rx.set(0); ry.set(0); glare.set(0.15);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative will-change-transform ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {/* glass glare */}
      <motion.div
        aria-hidden
        style={{
          opacity: glareOpacity,
          transform: "translateZ(40px)",
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.25), rgba(255,255,255,0.06) 30%, transparent 60%)",
        }}
        className="pointer-events-none absolute inset-0 rounded-2xl"
      />
      <div style={{ transform: "translateZ(30px)" }} className="relative">
        {children}
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [activeProject, setActiveProject] = useState<number>(1);

  const projects: Project[] = [
    {
      id: 1,
      title: "AI-Powered Financial Dashboard",
      description:
        "Professional-grade financial analytics with live market feeds, ML insights, and optimization for enterprise portfolios.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
      technologies: [
        "React",
        "TypeScript",
        "Python",
        "TensorFlow",
        "D3.js",
        "FastAPI",
        "PostgreSQL",
      ],
      features: [
        "Real-time market data & streaming charts",
        "ML-driven risk prediction & alerts",
        "Portfolio optimization (MPT + constraints)",
        "Automated reporting with drilldowns",
        "Multi-currency with FX live rates",
      ],
      icon: <BarChart3 className="w-6 h-6" />,
      codeSnippet: `// Advanced portfolio optimization with ML\nclass PortfolioOptimizer {\n  constructor() {\n    this.model = tf.loadLayersModel('/models/portfolio-optimizer.json');\n  }\n  async optimizePortfolio(assets, constraints) {\n    const returns = await this.calculateExpectedReturns(assets);\n    const cov = await this.calculateCovarianceMatrix(assets);\n    const risk = await this.model.predict({\n      returns: tf.tensor2d(returns),\n      volatility: tf.tensor2d(cov),\n    });\n    return this.efficientFrontier({ expectedReturns: returns, riskMatrix: cov, riskTolerance: await risk.data(), constraints });\n  }\n}`,
    },
    {
      id: 2,
      title: "Dell Match – Developer Social Media",
      description:
        "A dev-first network for matching, collaborating, and sharing code with real-time chat, events, and projects.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
      technologies: [
        "React",
        "Node.js",
        "Socket.io",
        "MongoDB",
        "Redis",
        "Docker",
        "AWS",
      ],
      features: [
        "AI matchmaking for collaboration & dating",
        "Real-time chat, calls, and rooms",
        "Code-first social feed & snippets",
        "Team spaces with kanban & CI hooks",
        "Local tech events & RSVPs",
      ],
      icon: <Code className="w-6 h-6" />,
      codeSnippet: `// AI-powered developer matchmaking\nclass DevMatchmaker {\n  async findMatches(profile, prefs) {\n    const score = await this.compatibility(profile, prefs);\n    return this.rank(score).slice(0, 10);\n  }\n}`,
    },
    {
      id: 3,
      title: "Naan Mudhalvan – AI & BI Programs",
      description:
        "Interactive AI/BI learning for 150+ students with live notebooks, analytics, and AI feedback.",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200",
      technologies: [
        "React",
        "Python",
        "Jupyter",
        "TensorFlow",
        "Pandas",
        "Plotly",
        "FastAPI",
      ],
      features: [
        "Live coding modules & labs",
        "Progress analytics & heatmaps",
        "150+ student collaboration workspaces",
        "Auto-grading with AI tips",
        "BI toolchains & dashboards",
      ],
      icon: <BrainCircuit className="w-6 h-6" />,
      codeSnippet: `// Predict next module mastery\nclass LearningAnalyzer {\n  async predict(score, style, complexity) {\n    return model.predict(tf.tensor([score, ...style, complexity]));\n  }\n}`,
    },
    {
      id: 4,
      title: "Intelligent AI ChatBot Framework",
      description:
        "Context-aware conversational AI with multilingual NLU, streaming responses, and domain adapters.",
      image:
        "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200",
      technologies: [
        "Python",
        "Transformers",
        "FastAPI",
        "Redis",
        "PostgreSQL",
        "React",
        "WebSocket",
      ],
      features: [
        "Multilingual intent & sentiment",
        "Conversation memory graph",
        "Pluggable domain knowledge",
        "Token-streaming UI hooks",
        "Emotion-aware actions",
      ],
      icon: <MessageSquare className="w-6 h-6" />,
      codeSnippet: `// Contextual response planner\nconst reply = plan(message, intent, memory, kb);`,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  } as const;

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-24 bg-slate-950 text-slate-100 overflow-hidden"
      style={{ perspective: 1000 }}
    >
      <CrystalBlueBg />

      <div className="relative z-10 container max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300">
            Signature Projects
          </h2>
          <motion.p
            className="mt-3 text-blue-200/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.15 }}
          >
            Blue–crystal aesthetics. Cinematic motion. AI-first craft.
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {projects.map((p) => (
            <motion.button
              key={p.id}
              variants={item}
              onClick={() => setActiveProject(p.id)}
              className={`group relative inline-flex items-center gap-2 rounded-xl border px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                activeProject === p.id
                  ? "border-cyan-400/60 bg-gradient-to-r from-blue-700/40 via-cyan-700/40 to-indigo-700/40 shadow-lg shadow-cyan-500/20"
                  : "border-blue-500/20 bg-slate-900/60 hover:border-cyan-400/40 hover:bg-slate-900/80"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-cyan-300">{p.icon}</span>
              <span className="text-sm md:text-base text-blue-100/90">{p.title}</span>
              {activeProject === p.id && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute -bottom-[2px] left-3 right-3 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />)
              }
            </motion.button>
          ))}
        </motion.div>

        {/* Active project card */}
        {projects.map((project) => (
          project.id === activeProject && (
            <TiltCard key={project.id} className="rounded-2xl">
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="overflow-hidden rounded-2xl border border-blue-400/20 bg-slate-900/60 backdrop-blur-xl shadow-2xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Media */}
                  <div className="relative min-h-[260px] lg:min-h-[420px]">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ scale: 1.08, filter: "saturate(0.9)" }}
                      animate={{ scale: 1.02, filter: "saturate(1.05)" }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    {/* gradient veil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    {/* shimmering sweep */}
                    <motion.div
                      className="absolute inset-y-0 -left-1/3 w-1/3"
                      initial={{ x: "-50%", opacity: 0 }}
                      animate={{ x: ["-50%", "130%"], opacity: [0, 0.4, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.2 }}
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                        filter: "blur(6px)",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-cyan-300/90">{project.icon}</span>
                      <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-cyan-200 to-indigo-200">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-blue-100/85 mb-5 leading-relaxed">{project.description}</p>

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((t, i) => (
                        <motion.span
                          key={t}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.02 * i + 0.1 }}
                          className="rounded-full border border-cyan-400/30 bg-blue-900/30 px-3 py-1 text-xs text-blue-100/90"
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>

                    {/* Features */}
                    <h4 className="text-lg font-semibold text-cyan-200 mb-2">Key Features</h4>
                    <ul className="space-y-2 mb-6">
                      {project.features.map((f, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * i + 0.1 }}
                          className="flex items-start gap-2 text-blue-100/85"
                        >
                          <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400/20">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300"><polyline points="20 6 9 17 4 12"/></svg>
                          </span>
                          {f}
                        </motion.li>
                      ))}
                    </ul>

                    {/* Code peek */}
                    {project.codeSnippet && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="mb-6 rounded-lg border border-blue-400/20 bg-slate-950/70 p-4 shadow-inner"
                      >
                        <h5 className="mb-2 text-sm font-semibold text-cyan-200">Code Peek</h5>
                        <pre className="overflow-x-auto text-[12px] leading-relaxed text-cyan-100/90"><code>{project.codeSnippet}</code></pre>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <motion.a
                        href="#"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2 font-medium text-white shadow-lg shadow-cyan-500/30"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Play className="h-4 w-4" /> Live Demo
                      </motion.a>
                      <motion.a
                        href="#"
                        className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/40 px-5 py-2 font-medium text-blue-100/90 hover:bg-slate-900/70"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Github className="h-4 w-4" /> Source Code
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          )
        ))}

        {/* Footer blurb */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          <p className="text-blue-100/80">
            Built with precision, animated with intent — where AI motion meets crystal-blue clarity.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
