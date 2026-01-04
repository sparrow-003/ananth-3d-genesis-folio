import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import avatarImage1 from '@/assets/avatar-art-1.png';
import avatarImage3 from '@/assets/avatar-art-3.png';

interface AnimatedAvatarProps {
  variant: 'hero' | 'about' | 'contact';
  className?: string;
}

const AnimatedAvatar = memo(({ variant, className = '' }: AnimatedAvatarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Choose image based on variant
  const getImage = () => {
    switch (variant) {
      case 'hero':
        return avatarImage1;
      case 'about':
        return avatarImage3;
      case 'contact':
        return avatarImage1;
      default:
        return avatarImage1;
    }
  };

  // Simplified animation props
  const animationVariants = {
    hero: {
      y: [0, -15, 0],
      rotate: [0, 2, 0, -2, 0],
    },
    about: {
      y: [0, -12, 0],
      scale: [1, 1.02, 1],
    },
    contact: {
      y: [0, -10, 0],
      rotate: [-2, 2, -2],
    },
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Simple glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 blur-2xl"
        animate={{
          opacity: isHovered ? 0.7 : 0.4,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Reduced particle count */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-400/50"
            style={{
              left: `${20 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
      
      {/* Main image container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={animationVariants[variant]}
          transition={{
            duration: variant === 'hero' ? 6 : 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Simple ring */}
          <motion.div
            className="absolute -inset-3 rounded-full border border-emerald-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Image */}
          <div className="relative w-full aspect-square overflow-hidden rounded-3xl">
            <img
              src={getImage()}
              alt="Ananth Avatar"
              className="w-full h-full object-cover object-center rounded-3xl shadow-xl shadow-emerald-500/20 border border-emerald-500/20"
              loading="lazy"
              style={{ imageRendering: 'auto' }}
            />
            
            {/* Simple overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-emerald-500/5 pointer-events-none" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
});

AnimatedAvatar.displayName = 'AnimatedAvatar';

export default AnimatedAvatar;
