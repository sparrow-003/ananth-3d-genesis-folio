import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import AnimatedAvatar from "./AnimatedAvatar";

const fadeInUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: "easeOut" },
  },
});

const slideIn = (direction: "left" | "right" = "left", delay = 0) => ({
  hidden: { opacity: 0, x: direction === "left" ? -80 : 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, delay, ease: "easeOut" },
  },
});

const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, delay, ease: "easeOut" },
  },
});

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  return (
    <section
      id="about"
      className="min-h-screen py-24 relative w-full overflow-hidden"
      ref={ref}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/10 to-black -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10 animate-reverse-pulse" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Title Section with Modern Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          {/* 3D-Feel Avatar Section */}
          <motion.div
            className="relative group"
            variants={scaleIn(0)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.05, rotateY: 10, rotateX: -5 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative z-10 p-2 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden">
              <AnimatedAvatar variant="about" className="w-64 h-auto md:w-80 lg:w-[400px]" />
              {/* Subtle overlay reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Elite Typography Content */}
          <motion.div
            className="text-center lg:text-left flex-1"
            variants={fadeInUp(0.2)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6 tracking-widest uppercase"
              variants={fadeInUp(0.1)}
            >
              The Genesis of Innovation
            </motion.span>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-tight">
              Anand <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">N</span>
            </h2>
            <motion.p
              className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-light mb-8"
              variants={fadeInUp(0.3)}
            >
              I'm <span className="text-white font-medium">Anand</span> — a developer, educator, and innovator driven by curiosity and a desire to make technology more human, accessible, and impactful.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-4"
              variants={fadeInUp(0.4)}
            >
              <a href="#contact" className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Hire Me
              </a>
              <a href="#projects" className="px-8 py-3 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-md">
                View Projects
              </a>
            </motion.div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Journey Card with 3D Interaction */}
          <motion.div
            className="group"
            variants={slideIn("left", 0.4)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ y: -10 }}
          >
            <div className="h-full bg-white/[0.02] backdrop-blur-md rounded-3xl p-10 border border-white/10 shadow-xl group-hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-20 h-20 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">
                My Journey
              </h3>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>
                  My path began as a <span className="font-semibold text-emerald-400">B.Com graduate</span> with a deep interest in problem-solving. That interest grew into a passion for development and education.
                </p>
                <motion.p variants={fadeInUp(0.6)}>
                  I currently mentor <span className="text-emerald-400 font-bold">150+ students</span> in AI & BI through the Naan Mudhalvan program, while also serving as a Campus Ambassador at Averixis Solutions.
                </motion.p>
                <div className="pt-4 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs text-emerald-400 font-bold">AI</div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-emerald-400/80 tracking-wide">Pioneering AI Mentorship</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Expertises with Staggered Animations */}
          <motion.div
            className="group"
            variants={slideIn("right", 0.6)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ y: -10 }}
          >
            <div className="h-full bg-white/[0.02] backdrop-blur-md rounded-3xl p-10 border border-white/10 shadow-xl group-hover:border-teal-500/30 transition-all duration-500 overflow-hidden relative">
              <h3 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">
                What I Do
              </h3>
              <div className="space-y-8">
                {[
                  { title: "Full Stack Mastery", color: "from-emerald-400 to-emerald-600" },
                  { title: "AI prompt Engineering", color: "from-teal-400 to-teal-600" },
                  { title: "LLM Development", color: "from-cyan-400 to-cyan-600" },
                  { title: "Strategic Mentorship", color: "from-blue-400 to-blue-600" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative pl-8 border-l-2 border-white/5 hover:border-emerald-500/50 transition-colors duration-300"
                    variants={fadeInUp(0.1 * index)}
                  >
                    <div className={`absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-gradient-to-br ${item.color} shadow-[0_0_10px_rgba(16,185,129,0.5)]`} />
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h4>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${item.color}`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: "100%" } : { width: 0 }}
                        transition={{ duration: 1.5, delay: 0.8 + (index * 0.1) }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vision Section with Wide Card */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 rounded-3xl p-12 border border-white/10 backdrop-blur-xl relative overflow-hidden group shadow-2xl"
          variants={fadeInUp(0.8)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-black text-white mb-6">Vision & Impact</h3>
              <p className="text-xl text-gray-400 leading-relaxed font-light">
                I aim to create platforms that combine <span className="text-white font-medium">AI, creativity, and real-world problem-solving</span> to empower people globally. Beyond tech, I explore storytelling and personal growth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { n: "2+", l: "AI Years", c: "text-emerald-400" },
                { n: "150+", l: "Students", c: "text-teal-400" },
                { n: "50+", l: "Projects", c: "text-cyan-400" },
                { n: "∞", l: "Ambition", c: "text-white" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-white/30 transition-all">
                  <div className={`text-3xl font-black ${s.c} mb-1`}>{s.n}</div>
                  <div className="text-gray-500 text-sm uppercase tracking-tighter">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
