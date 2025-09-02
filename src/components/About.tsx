
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
    <section id="about" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="section-container">
        <motion.h2 
          className="section-title text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>
        
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A self-taught programmer with a B.Com background, passionate about technology and building innovative solutions
        </motion.p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Personal Info */}
          <motion.div 
            className="glass-card p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-purple">My Background</h3>
            <p className="mb-6 text-gray-300">
              As a B.Com graduate turned <span className="text-gradient font-semibold">Vibe Coder</span>, my journey into tech has been driven by passion and flow. 
              Currently teaching 150+ students AI & BI in the Naan Mudhalvan program while serving as Campus Ambassador at Averixis Solutions.
            </p>
            <p className="mb-6 text-gray-300">
              My teaching experience has given me a unique perspective on breaking down complex concepts and building practical solutions.
              From self-learning programming to educating the next generation of AI developers, I've found my rhythm in the coding vibe.
            </p>
            <p className="text-gray-300">
              Today, I blend education with innovation, creating AI-powered applications while inspiring students to embrace the 
              beautiful chaos of coding. Every line of code is written with purpose, every lesson taught with passion.
            </p>
          </motion.div>
          
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple/30"></div>
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                className="mb-8 relative pl-12"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
              >
                <div className="absolute left-0 w-8 h-8 rounded-full bg-purple flex items-center justify-center text-white text-sm">
                  {event.year.substring(2)}
                </div>
                <div className="glass-card p-6">
                  <h4 className="text-xl font-bold text-purple mb-2">{event.title}</h4>
                  <h5 className="text-sm text-gray-400 mb-2">{event.year}</h5>
                  <p className="text-gray-300">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Skills Progress Bars */}
        <motion.h3 
          className="text-3xl font-bold mt-16 mb-8 text-center text-gradient"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          Key Skills
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillsList.map((skill, index) => (
            <motion.div 
              key={skill.name}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium text-light">{skill.name}</span>
                <span className="text-purple">{skill.percentage}%</span>
              </div>
              <div className="h-3 bg-dark/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple to-purple-vibrant"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.percentage}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 1.2 + (index * 0.1) }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
