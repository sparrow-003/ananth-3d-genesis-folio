import { motion } from 'framer-motion';
import { Code, Terminal, Heart, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Architecture', href: '/#projects' },
    { name: 'The Log', href: '/blog' },
    { name: 'Connect', href: '/#contact' }
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-radial from-emerald-500/10 to-transparent blur-3xl -z-10 opacity-30" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-center">

          {/* Logo & Vision */}
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Cpu className="text-black w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">ANANTH<span className="text-emerald-500">.</span>N</span>
            </div>
            <p className="text-gray-500 font-medium max-w-xs mx-auto md:mx-0">
              Architecting the digital genesis through code, design, and continuous innovation.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="flex justify-center gap-8">
            {footerLinks.map(link => (
              <Link
                key={link.name}
                to={link.href}
                className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Status */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Online</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <Globe className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
              <Terminal className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
            © {currentYear} GENESIS FOLI0 — ALL SYSTEMS OPERATIONAL
          </p>

          <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
            MADE WITH <Heart className="w-3 h-3 text-red-500 animate-pulse fill-current" /> BY ANANTH N
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;