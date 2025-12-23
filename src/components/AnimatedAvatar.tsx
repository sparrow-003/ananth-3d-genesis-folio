import { motion } from 'framer-motion';
import { useRef } from 'react';
import avatarImage1 from '@/assets/avatar-art-1.png';
import avatarImage2 from '@/assets/avatar-art-2.png';

interface AnimatedAvatarProps {
  variant: 'hero' | 'about' | 'contact';
  className?: string;
}

const AnimatedAvatar = ({ variant, className = '' }: AnimatedAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Choose image based on variant
  const getImage = () => {
    switch (variant) {
      case 'hero':
        return avatarImage1;
      case 'about':
        return avatarImage2;
      case 'contact':
        return avatarImage1;
      default:
        return avatarImage1;
    }
  };

  const getAnimationProps = () => {
    switch (variant) {
      case 'hero':
        return {
          animate: {
            y: [0, -20, 0],
            rotateY: [0, 10, 0],
            rotateX: [-5, 5, -5],
          },
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'about':
        return {
          animate: {
            y: [0, -15, 0],
            rotateZ: [-2, 2, -2],
            scale: [1, 1.02, 1],
          },
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'contact':
        return {
          animate: {
            y: [0, -10, 0],
            rotateY: [-5, 5, -5],
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
    }
  };

  const animProps = getAnimationProps();

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-cyan-500/30 blur-3xl"
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating particles around avatar */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Main animated container */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Animated image wrapper */}
        <motion.div
          {...animProps}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ 
            scale: 1.05,
            rotateY: 15,
            transition: { duration: 0.3 }
          }}
        >
          {/* Ring effects */}
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-emerald-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -inset-8 rounded-full border border-teal-500/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Image container with 3D shadow */}
          <div className="relative">
            {/* 3D shadow layer */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-black/40 blur-xl"
              style={{ transform: 'translateZ(-50px) translateY(20px)' }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Main image */}
            <motion.img
              src={getImage()}
              alt="Ananth Avatar"
              className="w-full h-auto rounded-3xl shadow-2xl shadow-emerald-500/20 border-2 border-emerald-500/30"
              style={{ 
                filter: 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.3))',
              }}
              whileHover={{
                filter: 'drop-shadow(0 0 50px rgba(16, 185, 129, 0.5))',
              }}
            />
            
            {/* Glass overlay */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-emerald-500/10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{ x: ['0%', '200%'] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Corner accents */}
      <motion.div
        className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-emerald-500/50 rounded-tl-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-teal-500/50 rounded-br-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
};

export default AnimatedAvatar;
