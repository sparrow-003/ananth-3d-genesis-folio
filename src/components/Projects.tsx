
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  codeSnippet?: string;
  demoLink?: string;
}

const Projects = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeProject, setActiveProject] = useState<number>(1);
  
  const projects: Project[] = [
    {
      id: 1,
      title: "AI Financial Management Tool",
      description: "Powerful financial planning and analysis tool leveraging AI to provide personalized financial insights, budget recommendations, and investment strategies.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "TypeScript", "TensorFlow.js", "Chart.js", "Financial APIs"],
      features: [
        "AI-powered expense categorization and analysis",
        "Predictive budget forecasting",
        "Investment portfolio optimization",
        "Real-time financial alerts and notifications"
      ],
      codeSnippet: `// AI-powered investment recommendation
const generateInvestmentStrategy = async (riskTolerance, timeHorizon) => {
  setAnalyzing(true);
  try {
    const model = await tf.loadLayersModel('/models/investment-strategy/model.json');
    const inputTensor = tf.tensor2d([[
      riskTolerance, 
      timeHorizon, 
      currentMarketVolatility, 
      inflationRate
    ]]);
    
    const prediction = model.predict(inputTensor);
    const recommendedAllocation = await prediction.array();
    
    return {
      stocks: recommendedAllocation[0][0],
      bonds: recommendedAllocation[0][1],
      cash: recommendedAllocation[0][2],
      alternatives: recommendedAllocation[0][3]
    };
  } catch (error) {
    console.error('Strategy generation error:', error);
    return defaultAllocation;
  } finally {
    setAnalyzing(false);
  }
};`
    },
    {
      id: 2,
      title: "Sentiment Analysis for Dev Hub",
      description: "Revolutionary tool that analyzes developer sentiment across code repositories, pull requests, and issue comments to improve team collaboration and project health.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "Python", "Natural Language Processing", "GitHub API", "D3.js"],
      features: [
        "Real-time sentiment analysis of code reviews",
        "Team morale tracking and visualization",
        "Early burnout detection algorithms",
        "Communication improvement recommendations"
      ]
    },
    {
      id: 3,
      title: "Business Idea Generator",
      description: "Innovative AI-powered platform that generates viable business ideas based on market trends, user preferences, and identified gaps in various industries.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "AI/ML", "Market Analysis APIs", "Node.js", "MongoDB"],
      features: [
        "Industry-specific idea generation",
        "Market viability assessment",
        "Competition analysis and differentiation suggestions",
        "Financial projection and resource requirement estimation"
      ]
    },
    {
      id: 4,
      title: "Cinematic Job Application Assistant",
      description: "Create compelling job applications with cinematic-level storytelling techniques that make your professional narrative stand out to employers.",
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "GPT-4", "Narrative Analysis", "Resume Parsing", "Video Processing"],
      features: [
        "Cinematic resume storytelling generator",
        "Compelling cover letter creation",
        "Interview narrative coaching",
        "Personal brand development tools"
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
    <section id="projects" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="section-container">
        <motion.h2 
          className="section-title text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </motion.h2>
        
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Creating cutting-edge innovations at the intersection of art and technology
        </motion.p>
        
        {/* Project Selection Tabs with enhanced animation */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {projects.map((project) => (
            <motion.button
              key={project.id}
              className={`px-6 py-3 rounded-full transition-all ${
                activeProject === project.id 
                  ? 'bg-purple text-white shadow-lg shadow-purple/30' 
                  : 'bg-glass backdrop-blur-sm text-light hover:bg-purple/20'
              }`}
              whileHover={{ 
                scale: 1.05, 
                textShadow: "0 0 8px rgb(255,255,255)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveProject(project.id)}
            >
              {project.title}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Active Project Display with enhanced animations */}
        {projects.map((project) => (
          project.id === activeProject && (
            <motion.div 
              key={project.id}
              className="glass-card overflow-hidden border-purple/30 border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              layout
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Project Image with parallax effect */}
                <motion.div 
                  className="relative h-64 lg:h-auto overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img 
                    src={project.image} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-transparent lg:bg-gradient-to-t"></div>
                  <div className="absolute bottom-0 left-0 p-6 lg:hidden">
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <motion.span 
                          key={tech} 
                          className="px-3 py-1 bg-purple/30 backdrop-blur-sm rounded-full text-xs text-white"
                          whileHover={{ backgroundColor: "rgba(155, 135, 245, 0.5)", scale: 1.05 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-3 py-1 bg-purple/30 backdrop-blur-sm rounded-full text-xs text-white">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
                
                {/* Project Details with enhanced animations */}
                <div className="p-8">
                  <div className="hidden lg:block">
                    <motion.h3 
                      className="text-3xl font-bold text-gradient mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {project.title}
                    </motion.h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, index) => (
                        <motion.span 
                          key={tech} 
                          className="px-3 py-1 bg-purple/20 rounded-full text-sm text-purple-light"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          whileHover={{ backgroundColor: "rgba(155, 135, 245, 0.3)", scale: 1.05 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  <motion.p 
                    className="text-gray-300 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {project.description}
                  </motion.p>
                  
                  <motion.h4 
                    className="text-xl font-semibold text-purple-light mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Key Features:
                  </motion.h4>
                  <ul className="list-disc list-inside mb-6 text-gray-300 space-y-1">
                    {project.features.map((feature, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + 0.1 * index }}
                      >
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  
                  {project.codeSnippet && (
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <h4 className="text-xl font-semibold text-purple-light mb-3">Code Snippet:</h4>
                      <div className="bg-black/70 p-4 rounded-md overflow-x-auto border border-purple/20">
                        <pre className="text-sm text-gray-300 font-mono">
                          <code>{project.codeSnippet}</code>
                        </pre>
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <motion.button
                      className="px-6 py-2 bg-purple rounded-full font-medium text-white shadow-lg shadow-purple/30 hover:bg-purple-vibrant transition-all"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(155, 135, 245, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live Demo
                    </motion.button>
                    <motion.button
                      className="px-6 py-2 border border-purple rounded-full font-medium text-light hover:bg-purple/10 transition-all"
                      whileHover={{ scale: 1.05, borderColor: "#D6BCFA" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Source Code
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        ))}
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-lg text-gray-300 mb-6">
            These projects showcase my approach to combining artistic vision with technical excellence.
            <br />Each creation pushes boundaries and delivers impactful results.
          </p>
          <motion.a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple rounded-full font-medium text-white shadow-lg shadow-purple/30 hover:bg-purple-vibrant transition-all"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(155, 135, 245, 0.6)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            View More Projects on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
