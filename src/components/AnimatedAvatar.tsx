import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import avatarImage1 from '@/assets/avatar-art-1.png';
import avatarImage2 from '@/assets/avatar-art-2.png';
import avatarImage3 from '@/assets/avatar-art-3.png';

interface AnimatedAvatarProps {
  variant: 'hero' | 'about' | 'contact';
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const AnimatedAvatar = ({ variant, className = '' }: AnimatedAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });

    // Add particle trail
    if (isHovered) {
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      
      const newParticle: Particle = {
        id: particleIdRef.current++,
        x: relativeX,
        y: relativeY,
        size: Math.random() * 8 + 4,
        opacity: 1,
      };
      
      setParticles(prev => [...prev.slice(-20), newParticle]);
    }
  };

  // Clean up particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const timer = setTimeout(() => {
      setParticles(prev => prev.slice(1));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [particles]);

  const getImage = () => {
    switch (variant) {
      case 'hero': return avatarImage1;
      case 'about': return avatarImage3;
      case 'contact': return avatarImage2;
      default: return avatarImage1;
    }
  };

  const getAnimationProps = () => {
    switch (variant) {
      case 'hero':
        return {
          animate: {
            y: [0, -30, 0],
            rotateY: [10, -10, 10],
            rotateX: [-5, 5, -5],
          },
          transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        };
      case 'about':
        return {
          animate: {
            y: [0, -25, 0],
            rotateZ: [-2, 2, -2],
            rotateY: [15, -15, 15],
          },
          transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
        };
      case 'contact':
        return {
          animate: {
            y: [0, -20, 0],
            rotateY: [-20, 20, -20],
            rotateX: [10, -10, 10],
          },
          transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative cursor-pointer transition-all duration-500 ${className}`}
      style={{ perspective: '2000px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
        setParticles([]);
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Particle Trail Effect */}
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none rounded-full"
          initial={{ 
            x: particle.x - particle.size / 2, 
            y: particle.y - particle.size / 2,
            scale: 1,
            opacity: 1
          }}
          animate={{ 
            scale: 0,
            opacity: 0,
            y: particle.y - particle.size / 2 - 30
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, ${
              variant === 'hero' ? 'rgba(16, 185, 129, 0.8)' : 
              variant === 'about' ? 'rgba(20, 184, 166, 0.8)' : 
              'rgba(6, 182, 212, 0.8)'
            }, transparent)`,
            boxShadow: `0 0 ${particle.size * 2}px ${
              variant === 'hero' ? 'rgba(16, 185, 129, 0.6)' : 
              variant === 'about' ? 'rgba(20, 184, 166, 0.6)' : 
              'rgba(6, 182, 212, 0.6)'
            }`,
            zIndex: 100,
          }}
        />
      ))}

      {/* 3D Global Glow */}
      <motion.div
        className="absolute inset-0 rounded-[3rem] bg-gradient-radial from-emerald-500/30 to-transparent blur-[60px] -z-10"
        animate={{
          scale: isHovered ? 1.3 : 0.8,
          opacity: isHovered ? 0.7 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Orbiting Tech Rings */}
      <motion.div
        className="absolute inset-[-20%] border border-emerald-500/20 rounded-full -z-10"
        animate={{ rotate: 360, rotateX: 60 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[-40%] border border-teal-500/10 rounded-full -z-10"
        animate={{ rotate: -360, rotateX: 75 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[-30%] border border-cyan-500/15 rounded-full -z-10"
        animate={{ rotate: 360, rotateY: 45 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Main 3D Container */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateX: isHovered ? mousePosition.y * -35 : 0,
          rotateY: isHovered ? mousePosition.x * 35 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          {...getAnimationProps()}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 3D Shadow Base */}
          <div className="absolute inset-4 bg-black/60 blur-2xl translate-y-12 scale-90 rounded-full opacity-50" />

          {/* Main Image Layer */}
          <div className="relative group">
            <motion.img
              src={getImage()}
              alt="Ananth Avatar"
              className="w-full h-auto rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-2 border-white/10 backdrop-blur-sm"
              style={{
                filter: isHovered ? 'brightness(1.15) contrast(1.1) saturate(1.1)' : 'brightness(1) contrast(1)',
                transform: 'translateZ(50px)'
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />

            {/* Glossy Reflection Overlay */}
            <motion.div
              className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/20 via-transparent to-white/5 pointer-events-none overflow-hidden"
              style={{ transform: 'translateZ(51px)' }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-b from-white/30 via-transparent to-transparent"
                animate={{
                  y: isHovered ? ['0%', '100%'] : '-50%',
                  x: isHovered ? ['0%', '50%'] : '0%',
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ skewY: '-30deg' }}
              />
            </motion.div>

            {/* Futuristic UI Accents */}
            <motion.div 
              className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-500/60 rounded-tl-lg" 
              style={{ transform: 'translateZ(60px)' }}
              animate={{ opacity: isHovered ? 1 : 0.5 }}
            />
            <motion.div 
              className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-teal-500/60 rounded-br-lg" 
              style={{ transform: 'translateZ(60px)' }}
              animate={{ opacity: isHovered ? 1 : 0.5 }}
            />
            <motion.div 
              className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-lg" 
              style={{ transform: 'translateZ(60px)' }}
              animate={{ opacity: isHovered ? 0.8 : 0.3 }}
            />
            <motion.div 
              className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400/40 rounded-bl-lg" 
              style={{ transform: 'translateZ(60px)' }}
              animate={{ opacity: isHovered ? 0.8 : 0.3 }}
            />

            {/* Scanning Line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-[1px] pointer-events-none"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ transform: 'translateZ(55px)' }}
            />
            
            {/* Horizontal scanning line */}
            <motion.div
              className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-teal-500/40 to-transparent blur-[1px] pointer-events-none"
              animate={{ left: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
              style={{ transform: 'translateZ(55px)' }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Particles Around Model */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 3 === 0 ? 'rgba(16, 185, 129, 0.8)' : 
              i % 3 === 1 ? 'rgba(20, 184, 166, 0.8)' : 
              'rgba(6, 182, 212, 0.8)'
            }, transparent)`,
            boxShadow: `0 0 8px ${
              i % 3 === 0 ? 'rgba(16, 185, 129, 0.6)' : 
              i % 3 === 1 ? 'rgba(20, 184, 166, 0.6)' : 
              'rgba(6, 182, 212, 0.6)'
            }`,
            left: `${50 + (i - 6) * 8}%`,
            top: '80%'
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-20, -120],
            x: [(i - 6) * 15, (i - 6) * 25],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Extra glow particles on hover */}
      {isHovered && [...Array(6)].map((_, i) => (
        <motion.div
          key={`hover-${i}`}
          className="absolute w-2 h-2 rounded-full bg-emerald-400/60"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedAvatar;
