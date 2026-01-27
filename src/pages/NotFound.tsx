import { useLocation, Link } from "react-router-dom";
import { useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";

const NotFound = memo(() => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/20 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <motion.div
        className="text-center px-6 relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block mb-8"
        >
          <AlertCircle className="w-24 h-24 text-emerald-500/50" />
        </motion.div>

        <h1 className="text-8xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20 tracking-tighter italic">
          404
        </h1>

        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">
          Node Not Found in Genesis
        </h2>

        <p className="text-emerald-400/60 max-w-md mx-auto mb-10 text-lg leading-relaxed">
          The coordinate <span className="text-emerald-400 font-mono underline decoration-emerald-500/30 decoration-2 underline-offset-4">{location.pathname}</span> does not exist in this digital reality.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10B98108_1px,transparent_1px),linear-gradient(to_bottom,#10B98108_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
    </div>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;