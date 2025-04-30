
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextProps {
  texts: string[];
  interval?: number;
  className?: string;
}

const AnimatedText = ({ texts, interval = 3000, className = '' }: AnimatedTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 500); // Half a second for the transition
    }, interval);

    return () => clearInterval(intervalId);
  }, [texts, interval]);

  // Enhanced animation variants
  const variants = {
    initial: { y: 20, opacity: 0, rotateX: 45 },
    animate: { y: 0, opacity: 1, rotateX: 0 },
    exit: { y: -20, opacity: 0, rotateX: -45 }
  };

  return (
    <div className="relative inline-block">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.span
            key={currentIndex}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`inline-block ${className}`}
          >
            {texts[currentIndex]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;
