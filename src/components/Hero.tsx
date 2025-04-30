
import { motion } from 'framer-motion';
import AnimatedText from './AnimatedText';

const Hero = () => {
  const roles = [
    "Python Developer",
    "JavaScript/TypeScript Developer",
    "AI Prompt Engineer",
    "AI Tools Expert"
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="section-container flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <motion.h2 
            className="text-xl md:text-2xl mb-4 text-purple-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Hello, I'm
          </motion.h2>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="text-gradient">Ananth N</span>
          </motion.h1>
          <motion.div 
            className="text-2xl md:text-3xl font-semibold mb-8 min-h-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            I'm a <AnimatedText texts={roles} className="text-purple" interval={2500} />
          </motion.div>
          <motion.p 
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Crafting innovative solutions with code and AI expertise. A self-taught developer building the future one project at a time.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.a
              href="#projects"
              className="px-8 py-3 bg-purple rounded-full font-medium text-white shadow-lg shadow-purple/30 hover:bg-purple-vibrant transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View My Work
            </motion.a>
            <motion.a
              href="#contact"
              className="px-8 py-3 border border-purple rounded-full font-medium text-light hover:bg-purple/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Me
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating indicator to scroll down */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          delay: 1.5,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-purple animate-bounce"
          >
            <path d="M7 13l5 5 5-5" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
