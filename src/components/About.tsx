
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const timelineEvents = [
    {
      year: "2019",
      title: "Started Self-Learning Journey",
      description: "Began learning Python fundamentals while completing B.Com degree"
    },
    {
      year: "2020",
      title: "Expanded to Web Development",
      description: "Learned JavaScript and started building simple web projects"
    },
    {
      year: "2021",
      title: "Advanced to TypeScript & React",
      description: "Mastered TypeScript and React for building modern web applications"
    },
    {
      year: "2022",
      title: "Discovered AI & Prompt Engineering",
      description: "Started exploring LLMs and AI integration in applications"
    },
    {
      year: "2023",
      title: "AI/BI Teaching & Campus Ambassador",
      description: "Teaching 150+ students AI & BI in Naan Mudhalvan program, Campus Ambassador at Averixis Solutions"
    },
    {
      year: "2024",
      title: "Vibe Coder Era",
      description: "Embracing the flow state of coding while building production-ready AI applications"
    }
  ];
  
  const skillsList = [
    { name: "Vibe Coding", percentage: 98 },
    { name: "Teaching AI/BI", percentage: 95 },
    { name: "Python", percentage: 90 },
    { name: "JavaScript", percentage: 85 },
    { name: "TypeScript", percentage: 80 },
    { name: "React", percentage: 85 },
    { name: "AI Integration", percentage: 95 },
    { name: "Campus Leadership", percentage: 88 }
  ];

  return (
    <section id="about" className="min-h-screen py-16 sm:py-20 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background via-background/98 to-violet-500/10 z-10" ref={ref}>
      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-violet-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-green-400/15 to-emerald-600/5 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-yellow-400/10 to-amber-600/5 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:60px_60px] opacity-5 animate-pulse-slow"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-violet-400/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 border-2 border-green-400/20 rotate-45 animate-reverse-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20">
        {/* Enhanced Section Header */}
        <motion.div 
          className="text-center mb-16 sm:mb-20 lg:mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="section-title relative inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="relative z-10">About Me</span>
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-green-600/20 blur-xl rounded-full animate-pulse-glow"></div>
          </motion.h2>
          
          <motion.p 
            className="section-subtitle mt-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A <span className="text-gradient font-bold">Vibe Coder</span> with B.Com background, teaching 150+ students and building innovative AI solutions
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Personal Info with enhanced design */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-green-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 lg:p-10 relative z-10 hover:border-primary/50 transition-all duration-300 shadow-xl">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center">
                  <span className="text-violet-400">🚀</span>
                </div>
                Vibe Coder Background
              </h3>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  As a B.Com graduate turned <span className="text-gradient font-semibold">Vibe Coder</span>, my journey into tech has been driven by passion and flow. 
                  Currently teaching <span className="text-green-400 font-semibold">150+ students AI & BI</span> in the Naan Mudhalvan program while serving as <span className="text-violet-400 font-semibold">Campus Ambassador at Averixis Solutions</span>.
                </p>
                <p className="text-lg">
                  My teaching experience has given me a unique perspective on breaking down complex concepts and building practical solutions.
                  From self-learning programming to educating the next generation of AI developers, I've found my rhythm in the <span className="text-gradient font-semibold">coding vibe</span>.
                </p>
                <p className="text-lg">
                  Today, I blend education with innovation, creating AI-powered applications while inspiring students to embrace the 
                  beautiful chaos of coding. <span className="text-yellow-400 font-semibold">Every line of code is written with purpose, every lesson taught with passion.</span>
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced Timeline */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 via-purple-500 to-green-500 rounded-full shadow-lg shadow-violet-500/50"></div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-8 text-gradient flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400">⏱️</span>
              </div>
              Journey Timeline
            </h3>
            
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                className="mb-8 lg:mb-12 relative pl-16"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 1 + (index * 0.15) }}
              >
                <div className="absolute left-2 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/50 border-2 border-violet-400/50">
                  {event.year.substring(2)}
                </div>
                <motion.div 
                  className="glass-card p-6 lg:p-8 border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/10 to-green-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <h4 className="text-xl lg:text-2xl font-bold text-gradient mb-2">{event.title}</h4>
                    <h5 className="text-sm text-violet-400 mb-3 font-semibold">{event.year}</h5>
                    <p className="text-gray-300 text-lg leading-relaxed">{event.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Enhanced Skills Progress Bars */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="absolute -inset-8 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-green-600/10 rounded-3xl blur-2xl"></div>
          <div className="glass-card p-8 lg:p-12 relative z-10 border-violet-500/30">
            <motion.h3 
              className="text-3xl lg:text-4xl font-bold mb-12 text-center text-gradient flex items-center justify-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400">⚡</span>
              </div>
              Vibe Skills Mastery
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {skillsList.map((skill, index) => (
                <motion.div 
                  key={skill.name}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 1.6 + (index * 0.1) }}
                >
                  <div className="glass-card p-6 lg:p-8 border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 hover:scale-105">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold text-light text-lg">{skill.name}</span>
                      <span className="text-gradient font-bold text-lg">{skill.percentage}%</span>
                    </div>
                    <div className="h-4 bg-dark/50 rounded-full overflow-hidden relative">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-green-500 rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.percentage}%` } : { width: 0 }}
                        transition={{ duration: 1.5, delay: 1.8 + (index * 0.1), ease: "easeInOut" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
