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
  
  // Choose image based on variant
  const getImage = () => {
    switch (variant) {
      case 'hero':
        return avatarImage1;
      case 'about':
        return avatarImage3;
      case 'contact':
        return avatarImage1; // Using avatar-art-1 for contact page
      default:
        return avatarImage1;
    }
  };

  const getAnimationProps = () => {
    switch (variant) {
      case 'hero':
        return {
          animate: {
            y: [0, -25, 0],
            rotateY: [0, 15, 0, -15, 0],
            rotateX: [-8, 8, -8],
            scale: [1, 1.03, 1],
          },
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'about':
        return {
          animate: {
            y: [0, -20, 0],
            rotateZ: [-3, 3, -3],
            rotateY: [0, 8, 0, -8, 0],
            scale: [1, 1.05, 1],
          },
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'contact':
        return {
          animate: {
            y: [0, -18, 0],
            rotateY: [-10, 10, -10],
            rotateX: [5, -5, 5],
            scale: [1, 1.04, 1],
          },
          transition: {
            duration: 5,
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
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/40 via-teal-500/30 to-cyan-500/40 blur-3xl"
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : [0.4, 0.7, 0.4],
          scale: isHovered ? [1, 1.15, 1] : [0.95, 1.05, 0.95],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Secondary glow layer */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-500/20 via-transparent to-blue-500/20 blur-2xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1.05, 0.95, 1.05],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Enhanced floating particles around avatar */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'w-3 h-3 bg-emerald-400/70' : i % 3 === 1 ? 'w-2 h-2 bg-teal-400/60' : 'w-1.5 h-1.5 bg-cyan-400/50'}`}
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
            }}
            animate={{
              y: [0, -40 - (i * 5), 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * (15 + i * 2), 0],
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2.5 + (i * 0.3),
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Orbiting particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            style={{
              left: '50%',
              top: i % 2 === 0 ? '-5%' : '105%',
              marginLeft: i < 2 ? '-50%' : '50%',
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>
      
      {/* Main animated container */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.7, rotateY: -30, rotateX: 15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", type: "spring", stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Animated image wrapper */}
        <motion.div
          {...animProps}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ 
            scale: 1.08,
            rotateY: 20,
            rotateX: -10,
            transition: { duration: 0.4, type: "spring", stiffness: 200 }
          }}
          whileTap={{
            scale: 0.95,
            rotateZ: 5,
            transition: { duration: 0.1 }
          }}
        >
          {/* Enhanced ring effects */}
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-emerald-500/40"
            animate={{ 
              rotate: 360,
              borderColor: ['rgba(16, 185, 129, 0.4)', 'rgba(20, 184, 166, 0.4)', 'rgba(6, 182, 212, 0.4)', 'rgba(16, 185, 129, 0.4)']
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -inset-8 rounded-full border border-teal-500/30"
            animate={{ 
              rotate: -360,
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -inset-12 rounded-full border border-cyan-500/20"
            animate={{ 
              rotate: 360,
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
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
