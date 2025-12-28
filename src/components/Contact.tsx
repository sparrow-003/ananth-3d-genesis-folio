import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Download } from 'lucide-react';
import AnimatedAvatar from './AnimatedAvatar';

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      (e.target as HTMLFormElement).reset();

      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1500);
  };

  const handleHireMe = () => {
    const subject = "Project Inquiry - I'd Like to Hire You";
    const body = `Hello Ananth,

I came across your impressive portfolio and I'm interested in discussing a potential project.

I'd love to hear more about your expertise in AI and Full Stack development.

Best regards,`;

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Ananth_Resume.docx';
    link.download = 'Ananth_Resume.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden" ref={ref}>
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950/20 to-black -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-float" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -z-10 animate-float-slow" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-24">
          <motion.div
            className="flex-shrink-0 relative group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <AnimatedAvatar variant="contact" className="w-48 h-auto md:w-64 lg:w-80 relative z-10" />
          </motion.div>

          <motion.div
            className="text-center lg:text-left flex-1"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Let's Connect</span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
              Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Revolution.</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-10">
              Ready to turn your vision into reality? Whether it's AI-driven apps or full-stack solutions, I'm here to build the future with you.
            </p>

            <motion.button
              onClick={handleHireMe}
              className="group relative px-10 py-5 bg-emerald-500 text-black font-black text-xl rounded-2xl overflow-hidden active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Send className="w-6 h-6" />
                HIRE ME NOW
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </motion.button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Elite Glassmorphism Form */}
          <motion.div
            className="lg:col-span-8 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden group"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-500/10 transition-colors" />
            <h3 className="text-3xl font-bold text-white mb-10">Send a Mission Brief</h3>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                    <input
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                      placeholder="Anand Dev"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                    <input
                      type="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                      placeholder="anand@genesis.io"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                    placeholder="Project Inquiry"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  required
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-gray-600 resize-none"
                  placeholder="The future starts here..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="w-full md:w-auto px-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-3 active:scale-95"
                whileHover={{ y: -2 }}
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'idle' && (
                  <>
                    <Send className="w-5 h-5 text-emerald-400" />
                    Launch Message
                  </>
                )}
                {formStatus === 'submitting' && <span className="animate-pulse">Transmitting...</span>}
                {formStatus === 'success' && <span className="text-emerald-400">Transmission Successful!</span>}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Details & Socials */}
          <motion.div
            className="lg:col-span-4 space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-xl">
              <h4 className="text-xl font-bold text-white mb-8 tracking-tight">Direct Channels</h4>
              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Neural Link", value: "+91 6384227309", color: "text-emerald-400" },
                  { icon: Mail, label: "Data Stream", value: "thanan757@gmail.com", color: "text-teal-400" },
                  { icon: MapPin, label: "Core Location", value: "Madurai, India", color: "text-cyan-400" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 group cursor-pointer"
                    whileHover={{ x: 8 }}
                  >
                    <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 transition-all`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">{item.label}</p>
                      <p className="text-gray-200 font-medium">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Elite Social Grid */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-xl">
              <h4 className="text-xl font-bold text-white mb-8 tracking-tight">External Nodes</h4>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: "linkedin", url: "https://www.linkedin.com/in/ananth-n-583036233" },
                  { icon: "github", url: "https://github.com/sparrow-003" },
                  { icon: "instagram", url: "https://www.instagram.com/_alexxz_0" },
                  { icon: "whatsapp", url: "https://api.whatsapp.com/send?phone=916384227309" },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.url}
                    target="_blank"
                    className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* SVG Icons for socials */}
                    {social.icon === "linkedin" && <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>}
                    {social.icon === "github" && <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>}
                    {social.icon === "instagram" && <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>}
                    {social.icon === "whatsapp" && <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm6.304-4.055c1.552.921 3.31 1.408 5.103 1.409 5.421 0 9.832-4.412 9.835-9.832.001-2.628-1.023-5.097-2.88-6.956-1.857-1.859-4.325-2.883-6.953-2.884-5.424 0-9.835 4.411-9.838 9.83.001 1.921.56 3.791 1.616 5.385l-1.018 3.722 3.816-1.001zm10.975-6.73c-.273-.137-1.614-.797-1.863-.888-.249-.091-.43-.137-.611.137-.181.273-.701.888-.859 1.07-.158.182-.317.205-.59.068-.273-.137-1.15-.425-2.191-1.353-.808-.721-1.353-1.611-1.511-1.884-.158-.273-.017-.42.12-.556.123-.122.273-.319.41-.478.136-.159.182-.273.273-.455.09-.182.045-.341-.023-.478-.068-.137-.611-1.472-.837-2.019-.22-.53-.442-.457-.611-.466-.158-.008-.339-.01-.52-.01-.181 0-.476.068-.725.341-.249.273-.951.932-.951 2.272s.974 2.64 1.11 2.822c.136.182 1.919 2.93 4.648 4.113.649.282 1.157.45 1.551.576.652.207 1.245.178 1.714.108.523-.078 1.614-.66 1.841-1.298.226-.638.226-1.185.158-1.298-.068-.113-.249-.204-.522-.341z" /></svg>}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Footer with cinematic animation */}
      <footer className="mt-20 border-t border-white/5 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.p
            className="text-gray-500 font-medium"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1 }}
          >
            © 2025 Ananth N. All Rights Reserved.
          </motion.p>
          <motion.p
            className="text-gray-600 text-sm mt-3 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.2 }}
          >
            Building the Digital Genesis
          </motion.p>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
