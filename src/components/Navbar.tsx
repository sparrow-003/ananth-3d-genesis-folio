
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Articles', href: 'https://ananthdev.blogspot.com/', external: true },
    { name: 'Hire Me', href: 'mailto', isHireMe: true }
  ];

  const handleHireMe = () => {
    const subject = encodeURIComponent("Hiring Inquiry - Let's Work Together!");
    const body = encodeURIComponent(
      `Hi Ananth,\n\nI came across your portfolio and I'm impressed with your work!\n\nI would like to discuss a potential opportunity/project with you.\n\nProject Details:\n- \n\nLooking forward to hearing from you.\n\nBest regards,`
    );
    window.location.href = `mailto:thanan757@gmail.com?subject=${subject}&body=${body}`;
    setMobileMenuOpen(false);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);

    if (href.startsWith('/#')) {
      const id = href.substring(1); // remove the '/'
      if (location.pathname === '/') {
        const element = document.querySelector(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(href);
      }
    } else if (href.startsWith('/')) {
      navigate(href);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className={`fixed top-0 left-0 right-0 w-full z-50 px-4 sm:px-6 transition-all duration-500 ${isScrolled ? 'glass-nav py-3 backdrop-blur-xl shadow-xl shadow-purple/10' : 'py-4 bg-black/20 backdrop-blur-sm'
          }`}
        style={{
          borderBottom: isScrolled ? '1px solid rgba(155, 135, 245, 0.1)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`text-sm lg:text-base font-bold transition-all ${item.name === 'Blog'
                    ? 'px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                    : 'text-light opacity-80 hover:opacity-100 hover:text-purple'
                  }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.1 * index, duration: 0.5 }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  if ((item as any).isHireMe) {
                    handleHireMe();
                  } else if (!item.external) {
                    scrollToSection(item.href);
                  } else {
                    window.open(item.href, '_blank');
                  }
                }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none text-light"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-14 sm:top-16 left-0 right-0 z-40 glass-nav py-4 md:hidden"
          >
            <div className="flex flex-col items-center space-y-4 px-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-light text-lg py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    if ((item as any).isHireMe) {
                      handleHireMe();
                    } else if (!item.external) {
                      scrollToSection(item.href);
                    } else {
                      window.open(item.href, '_blank');
                    }
                  }}
                  target={item.external && !(item as any).isHireMe ? '_blank' : undefined}
                  rel={item.external && !(item as any).isHireMe ? 'noopener noreferrer' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator - Small arrow bouncing at bottom of viewport */}
      <motion.div
        className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          delay: 2,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-purple"
        >
          <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
        </svg>
      </motion.div>
    </>
  );
};

export default Navbar;
