
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const Skills = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      ]
    },
    {
      title: "Web Development",
      skills: [
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      ]
    },
    {
      title: "AI & Tools",
      skills: [
        { name: "Prompt Engineering", icon: "https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-ai-industry-4-flaticons-flat-flat-icons.png" },
        { name: "LLM Integration", icon: "https://img.icons8.com/color/48/artificial-intelligence.png" },
        { name: "API Implementation", icon: "https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-api-no-code-flaticons-flat-flat-icons.png" },
      ]
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
        { name: "Three.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" },
        { name: "TailwindCSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
      ]
    }
  ];
  
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
    <section id="skills" className="py-24 relative overflow-hidden bg-gradient-to-b from-dark to-dark/50" ref={ref}>
      <div className="section-container">
        <motion.h2 
          className="section-title text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          My Skills
        </motion.h2>
        
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A diverse toolbox of programming languages and technologies I've mastered through self-learning
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div 
              key={category.title}
              className="glass-card p-8"
              variants={itemVariants}
              transition={{ duration: 0.5, delay: 0.3 + (categoryIndex * 0.1) }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gradient">{category.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {category.skills.map((skill) => (
                  <div 
                    key={skill.name}
                    className="flex flex-col items-center justify-center"
                  >
                    <motion.div 
                      className="w-20 h-20 bg-glass backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group hover:bg-purple/20 transition-all"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <img 
                        src={skill.icon} 
                        alt={skill.name} 
                        className="w-10 h-10 object-contain filter saturate-0 opacity-80 group-hover:saturate-100 group-hover:opacity-100 transition-all" 
                      />
                    </motion.div>
                    <span className="text-center text-gray-300">{skill.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 glass-card p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-gradient">Always Learning</h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            As a self-taught developer, I'm constantly expanding my skillset through online courses,
            documentation, and building real-world projects. I believe in the power of continuous learning
            and staying up-to-date with the latest technologies.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
