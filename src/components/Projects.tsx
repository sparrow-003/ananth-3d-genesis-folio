
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Code, BrainCircuit, MessageSquare, BarChart3 } from 'lucide-react';

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

const Projects = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeProject, setActiveProject] = useState<number>(1);
  
  const projects: Project[] = [
    {
      id: 1,
      title: "Financial Management Dashboard",
      description: "An advanced financial analytics platform with AI-powered insights, real-time tracking, and predictive budget forecasting for optimal financial management.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "TypeScript", "TensorFlow.js", "D3.js", "Financial APIs"],
      features: [
        "Real-time financial data visualization",
        "ML-powered expense categorization",
        "Predictive budget analysis",
        "Investment portfolio optimization"
      ],
      icon: <BarChart3 className="stroke-yellow-400" />,
      codeSnippet: `// AI-powered investment strategy generator
const generateInvestmentStrategy = async (profile) => {
  const { riskTolerance, timeHorizon } = profile;
  
  // Initialize TensorFlow model
  const model = await tf.loadLayersModel('/models/investment/model.json');
  
  // Create tensor from input parameters
  const inputTensor = tf.tensor2d([[
    riskTolerance, 
    timeHorizon, 
    market.volatility, 
    economic.inflationRate
  ]]);
  
  // Generate optimized allocation
  const prediction = model.predict(inputTensor);
  const allocation = await prediction.array();
  
  // Return structured portfolio recommendation
  return {
    stocks: allocation[0][0].toFixed(2),
    bonds: allocation[0][1].toFixed(2),
    alternatives: allocation[0][2].toFixed(2),
    cash: allocation[0][3].toFixed(2)
  };
};`
    },
    {
      id: 2,
      title: "AI Business Idea Generator",
      description: "Revolutionary platform that leverages market data and AI algorithms to identify lucrative business opportunities and generate innovative startup concepts.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "GPT-4", "Market Analysis APIs", "Node.js", "MongoDB"],
      features: [
        "Industry gap analysis",
        "Market viability assessment",
        "Unique value proposition generation",
        "Business model canvas creation"
      ],
      icon: <BrainCircuit className="stroke-green-400" />,
      codeSnippet: `// Business idea generation algorithm
async function generateBusinessIdea(params) {
  const { industry, investment, location, trends } = params;
  
  // Analyze market gaps using proprietary algorithm
  const marketGaps = await MarketAnalyzer.findOpportunities({
    industry,
    location,
    capitalRequired: investment
  });
  
  // Generate ideas based on current trends and gaps
  const ideas = await AIEngine.createConcepts({
    marketGaps,
    trendsData: trends,
    viabilityThreshold: 0.75
  });
  
  // Calculate success probability
  return ideas.map(idea => ({
    ...idea,
    successProbability: calculateViability(idea, market.conditions)
  })).sort((a, b) => b.successProbability - a.successProbability);
}`
    },
    {
      id: 3,
      title: "AI Chat Bot Framework",
      description: "Sophisticated conversational AI platform that enables businesses to deploy intelligent chatbots with natural language processing and context-aware responses.",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "Natural Language Processing", "TensorFlow.js", "Socket.io", "Redis"],
      features: [
        "Context-aware conversation handling",
        "Multi-language support",
        "Sentiment analysis integration",
        "Dynamic response generation"
      ],
      icon: <MessageSquare className="stroke-purple-400" />,
      codeSnippet: `// Context-aware response generator
class ConversationalEngine {
  constructor(modelPath, options) {
    this.contextWindow = [];
    this.sentimentAnalyzer = new SentimentEngine();
    this.loadModel(modelPath);
    this.entityExtractor = new EntityRecognition();
  }

  async processMessage(message, userId) {
    // Update context window
    this.updateContext(userId, message);
    
    // Extract intent and entities
    const intent = await this.modelInference({
      message,
      context: this.contextWindow
    });
    
    // Generate appropriate response
    return this.responseGenerator.create({
      intent,
      entities: this.entityExtractor.find(message),
      sentiment: this.sentimentAnalyzer.analyze(message),
      context: this.getRecentContext(userId, 5)
    });
  }
}`
    },
    {
      id: 4,
      title: "Dev Hub Collaboration Platform",
      description: "Comprehensive development platform that enhances team collaboration through code analytics, productivity insights, and integrated project management.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      technologies: ["React", "TypeScript", "GraphQL", "GitHub API", "PostgreSQL"],
      features: [
        "Real-time code collaboration",
        "Developer productivity analytics",
        "Automated code review suggestions",
        "Team sentiment analysis"
      ],
      icon: <Code className="stroke-violet-400" />,
      codeSnippet: `// Code quality analyzer
const analyzeCodeQuality = async (repository) => {
  // Initialize analysis modules
  const complexity = new ComplexityAnalyzer();
  const security = new SecurityScanner();
  const performance = new PerformanceMetrics();
  
  // Clone repository and analyze
  const codebase = await GitService.clone(repository.url);
  
  // Run parallel analysis
  const [complexityReport, securityIssues, perfMetrics] = await Promise.all([
    complexity.analyze(codebase),
    security.scanVulnerabilities(codebase),
    performance.evaluate(codebase)
  ]);
  
  // Generate comprehensive quality report
  return {
    qualityScore: calculateOverallScore({
      complexity: complexityReport,
      security: securityIssues,
      performance: perfMetrics
    }),
    details: {
      complexityReport,
      securityIssues,
      perfMetrics
    },
    recommendations: generateRecommendations({
      complexityReport,
      securityIssues,
      perfMetrics
    })
  };
};`
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
    <section id="projects" className="py-24 relative overflow-hidden bg-gradient-to-b from-dark/90 to-dark" ref={ref}>
      {/* 3D Elements Related to Projects */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-yellow-400/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border-2 border-green-400/20 rounded-full animate-reverse-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-violet-400/20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="section-container relative z-10">
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
          Innovative solutions at the intersection of technology, design, and business value
        </motion.p>
        
        {/* Project Selection Tabs with enhanced animation */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {projects.map((project) => (
            <motion.button
              key={project.id}
              className={`px-5 py-3 rounded-full transition-all flex items-center gap-2 ${
                activeProject === project.id 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-500/30' 
                  : 'bg-glass backdrop-blur-sm border border-gray-700/30 text-light hover:bg-purple/20'
              }`}
              whileHover={{ 
                scale: 1.05, 
                textShadow: "0 0 8px rgb(255,255,255)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveProject(project.id)}
            >
              <span className="text-xl">
                {project.icon}
              </span>
              <span className="font-medium">{project.title}</span>
            </motion.button>
          ))}
        </motion.div>
        
        {/* Active Project Display with enhanced animations */}
        {projects.map((project) => (
          project.id === activeProject && (
            <motion.div 
              key={project.id}
              className="glass-card overflow-hidden border-purple/30 border shadow-2xl shadow-violet-500/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              layout
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Project Image with advanced effects */}
                <motion.div 
                  className="relative h-64 lg:h-auto overflow-hidden cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img 
                    src={project.image} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
                    initial={{ scale: 1.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      filter: "saturate(1.2) brightness(1.1)"
                    }}
                    transition={{ duration: 1.5 }}
                  />
                  {/* Image overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-transparent lg:bg-gradient-to-t"></div>
                  <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Floating elements on hover */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex gap-4">
                      <motion.button 
                        className="w-12 h-12 rounded-full bg-violet-600/80 text-white flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 180 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"></path>
                        </svg>
                      </motion.button>
                      
                      <motion.button 
                        className="w-12 h-12 rounded-full bg-green-500/80 text-white flex items-center justify-center"
                        whileHover={{ scale: 1.2, y: -10 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  <div className="absolute bottom-0 left-0 p-6 lg:hidden">
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <motion.span 
                          key={tech} 
                          className="px-3 py-1 bg-violet-600/30 backdrop-blur-sm rounded-full text-xs text-white"
                          whileHover={{ backgroundColor: "rgba(124, 58, 237, 0.5)", scale: 1.05 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-3 py-1 bg-violet-600/30 backdrop-blur-sm rounded-full text-xs text-white">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
                
                {/* Project Details with enhanced animations */}
                <div className="p-8">
                  <div className="hidden lg:block">
                    <motion.div 
                      className="flex items-center gap-3 mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-3xl">
                        {project.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-gradient">
                        {project.title}
                      </h3>
                    </motion.div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, index) => (
                        <motion.span 
                          key={tech} 
                          className="px-3 py-1 bg-violet-600/10 rounded-full text-sm text-violet-300 border border-violet-500/20"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          whileHover={{ backgroundColor: "rgba(124, 58, 237, 0.3)", scale: 1.05 }}
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
                    className="text-xl font-semibold text-violet-300 mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Key Features:
                  </motion.h4>
                  <ul className="list-none mb-6 text-gray-300 space-y-2">
                    {project.features.map((feature, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + 0.1 * index }}
                        className="flex items-start gap-2"
                      >
                        <span className="text-green-400 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
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
                      <h4 className="text-xl font-semibold text-violet-300 mb-3">Code Sprint:</h4>
                      <div className="bg-black/80 p-4 rounded-md overflow-x-auto border border-violet-500/20 shadow-inner shadow-violet-500/5">
                        <pre className="text-sm text-green-300 font-mono">
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
                      className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-700 rounded-full font-medium text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all group relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polygon points="10 8 16 12 10 16 10 8"></polygon>
                        </svg>
                        Live Demo
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </motion.button>
                    <motion.button
                      className="px-6 py-2 border border-violet-500 rounded-full font-medium text-light hover:bg-violet-600/10 transition-all flex items-center gap-2"
                      whileHover={{ scale: 1.05, borderColor: "#8B5CF6" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
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
            These projects showcase my approach to combining technical excellence with creative solutions.
            <br />Each creation pushes boundaries and delivers meaningful business impact.
          </p>
          <motion.a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-700 rounded-full font-medium text-white shadow-lg shadow-purple/30 hover:bg-purple-vibrant transition-all"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124, 58, 237, 0.6)" }}
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
