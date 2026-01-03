import { motion } from 'framer-motion';
import { Code, Terminal } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black/95 border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          {/* Main tagline */}
          <motion.p 
            className="text-sm text-gray-400 text-center flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            Crafting digital experiences at the intersection of art and technology
            <Code className="w-4 h-4 text-emerald-400" />
          </motion.p>
          
          {/* Copyright */}
          <motion.p 
            className="text-xs text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            © {currentYear} Ananth N. All Rights Reserved.
          </motion.p>
          
          {/* Decorative line */}
          <motion.div
            className="h-0.5 w-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;