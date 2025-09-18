import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, Code, Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: Github, 
      href: '#', 
      label: 'GitHub',
      color: 'hover:text-purple-400'
    },
    { 
      icon: Linkedin, 
      href: '#', 
      label: 'LinkedIn',
      color: 'hover:text-blue-400'
    },
    { 
      icon: Mail, 
      href: 'mailto:contact@ananthn.dev', 
      label: 'Email',
      color: 'hover:text-green-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 120
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden bg-black/90 backdrop-blur-xl border-t border-purple-500/20"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.1, 1, 1.1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-cyan-500/5 via-purple-500/5 to-blue-500/5 rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Left: Brand */}
          <motion.div 
            variants={itemVariants}
            className="text-center md:text-left"
          >
            <motion.h3 
              className="text-2xl font-bold text-gradient mb-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Ananth N
            </motion.h3>
            <motion.p 
              className="text-gray-400 flex items-center justify-center md:justify-start gap-2"
              variants={itemVariants}
            >
              Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> and <Code className="w-4 h-4 text-blue-400" />
            </motion.p>
          </motion.div>

          {/* Center: Social Links */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center space-x-6"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                variants={iconVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm transition-all duration-300 ${social.color} hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20`}
                aria-label={social.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.2 * index }
                }}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* Right: Copyright */}
          <motion.div 
            variants={itemVariants}
            className="text-center md:text-right"
          >
            <motion.p 
              className="text-gray-500 flex items-center justify-center md:justify-end gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              © {currentYear} All rights reserved
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom decorative line */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-800/50"
          variants={itemVariants}
        >
          <motion.div
            className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full mx-auto"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ width: "100px" }}
          />
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;