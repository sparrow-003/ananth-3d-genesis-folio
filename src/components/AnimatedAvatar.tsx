import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import avatarImage1 from '@/assets/avatar-art-1.png';
import avatarImage2 from '@/assets/avatar-art-2.png';
import avatarImage3 from '@/assets/avatar-art-3.png';

interface AnimatedAvatarProps {
  variant: 'hero' | 'about' | 'contact';
  className?: string;
}

const AnimatedAvatar = ({ variant, className = '' }: AnimatedAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

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
      }}
      onMouseMove={handleMouseMove}
    >
      {/* 3D Global Glow */}
      <motion.div
        className="absolute inset-0 rounded-[3rem] bg-gradient-radial from-emerald-500/30 to-transparent blur-[60px] -z-10"
        animate={{
          scale: isHovered ? 1.2 : 0.8,
          opacity: isHovered ? 0.6 : 0.3,
        }}
      />

      {/* Orbiting Tech Rings */}
      <motion.div
        className="absolute inset-[-20%] border-[1px] border-emerald-500/20 rounded-full -z-10"
        animate={{ rotate: 360, rotateX: 60 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[-40%] border-[1px] border-teal-500/10 rounded-full -z-10"
        animate={{ rotate: -360, rotateX: 75 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Main 3D Container */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateX: isHovered ? mousePosition.y * -30 : 0,
          rotateY: isHovered ? mousePosition.x * 30 : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          {...getAnimationProps()}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 3D Shadow Base */}
          <div className="absolute inset-4 bg-black/60 blur-2xl translate-z-[-100px] translate-y-12 scale-90 rounded-full opacity-50" />

          {/* Main Image Layer */}
          <div className="relative group">
            <motion.img
              src={getImage()}
              alt="Ananth Avatar"
              className="w-full h-auto rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-2 border-white/10 backdrop-blur-sm"
              style={{
                filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)',
                transform: 'translateZ(50px)'
              }}
            />

            {/* Glossy Reflection Overlay */}
            <motion.div
              className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/20 via-transparent to-white/5 pointer-events-none overflow-hidden"
              style={{ transform: 'translateZ(51px)' }}
            >
              <div
                className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-b from-white/20 via-transparent to-transparent -translate-y-[50%] skew-y-[-30deg]"
                style={{
                  transform: `translateY(${mousePosition.y * 100}%) translateX(${mousePosition.x * 100}%) skewY(-30deg)`
                }}
              />
            </motion.div>

            {/* Futuristic UI Accents */}
            <div className="absolute top-4 left-4 w-10 h-1 border-t-2 border-l-2 border-emerald-500/50 rounded-tl-lg" style={{ transform: 'translateZ(60px)' }} />
            <div className="absolute bottom-4 right-4 w-10 h-1 border-b-2 border-r-2 border-teal-500/50 rounded-br-lg" style={{ transform: 'translateZ(60px)' }} />

            {/* Staggered Scanning Line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-emerald-500/30 blur-sm pointer-events-none"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ transform: 'translateZ(55px)' }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Particles Around Model */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[1px]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-20, -100],
            x: [(i - 4) * 20, (i - 4) * 30],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut"
          }}
          style={{
            left: `${50 + (i - 4) * 10}%`,
            top: '80%'
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedAvatar;
