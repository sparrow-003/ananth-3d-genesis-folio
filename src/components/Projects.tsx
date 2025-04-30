
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
      title: "AI Chatbot",
      description: "A real-time chat interface using React, TypeScript, and Google API integration that allows users to have natural conversations with an AI assistant.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "TypeScript", "Node.js", "Google API", "Tailwind CSS"],
      features: [
        "Real-time chat interface with typing indicators",
        "Google API integration for smart responses",
        "Message history with local storage",
        "Responsive design for all devices"
      ],
      codeSnippet: `// AI Chat Response Handler
const handleAIResponse = async (message: string) => {
  setLoading(true);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, apiKey: googleApiKey })
    });
    const data = await response.json();
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: data.response,
      sender: 'ai'
    }]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};`
    },
    {
      id: 2,
      title: "AI Image Generator",
      description: "Create unique images from text descriptions using AI. This application leverages the power of modern image generation models through API integration.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "TypeScript", "OpenAI API", "Framer Motion", "CSS Grid"],
      features: [
        "Text-to-image generation using AI",
        "Adjustable parameters for image style",
        "Gallery of generated images",
        "Download and share functionality"
      ]
    },
    {
      id: 3,
      title: "Voice-to-Text Transcription Tool",
      description: "Convert spoken words to text with high accuracy. This tool supports multiple languages and provides real-time transcription capabilities.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "JavaScript", "Web Speech API", "Express", "MongoDB"],
      features: [
        "Real-time voice transcription",
        "Multi-language support",
        "Editable transcript interface",
        "Export to various formats (TXT, PDF, DOCX)"
      ]
    },
    {
      id: 4,
      title: "Sentiment Analysis Dashboard",
      description: "Analyze text sentiment from social media, reviews, or any text input. Visualize sentiment trends and get actionable insights.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "Python", "TensorFlow", "Chart.js", "Flask API"],
      features: [
        "Real-time sentiment analysis engine",
        "Interactive data visualization",
        "Bulk text processing",
        "Sentiment trend reports"
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
          Showcasing my journey from concept to creation with these AI-powered applications
        </motion.p>
        
        {/* Project Selection Tabs */}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveProject(project.id)}
            >
              {project.title}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Active Project Display */}
        {projects.map((project) => (
          project.id === activeProject && (
            <motion.div 
              key={project.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              layout
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Project Image */}
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-transparent lg:bg-gradient-to-t"></div>
                  <div className="absolute bottom-0 left-0 p-6 lg:hidden">
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-purple/30 backdrop-blur-sm rounded-full text-xs text-white">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-3 py-1 bg-purple/30 backdrop-blur-sm rounded-full text-xs text-white">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Project Details */}
                <div className="p-8">
                  <div className="hidden lg:block">
                    <h3 className="text-3xl font-bold text-gradient mb-4">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-purple/20 rounded-full text-sm text-purple-light">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">{project.description}</p>
                  
                  <h4 className="text-xl font-semibold text-purple-light mb-3">Key Features:</h4>
                  <ul className="list-disc list-inside mb-6 text-gray-300 space-y-1">
                    {project.features.map((feature, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  
                  {project.codeSnippet && (
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-purple-light mb-3">Code Snippet:</h4>
                      <div className="bg-black/50 p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm text-gray-300 font-mono">
                          <code>{project.codeSnippet}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <motion.button
                      className="px-6 py-2 bg-purple rounded-full font-medium text-white shadow-lg shadow-purple/30 hover:bg-purple-vibrant transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live Demo
                    </motion.button>
                    <motion.button
                      className="px-6 py-2 border border-purple rounded-full font-medium text-light hover:bg-purple/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Source Code
                    </motion.button>
                  </div>
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
            These projects demonstrate my ability to integrate AI services and build polished user experiences.
            <br />Each one showcases different skills and approaches to problem-solving.
          </p>
          <motion.a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple rounded-full font-medium text-white shadow-lg shadow-purple/30 hover:bg-purple-vibrant transition-all"
            whileHover={{ scale: 1.05 }}
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
