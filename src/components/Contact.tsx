import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Download } from 'lucide-react';

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      (e.target as HTMLFormElement).reset();
      
      // Reset after success message
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1500);
  };

  const handleHireMe = () => {
    const subject = "Project Inquiry - I'd Like to Hire You";
    const body = `Hello Ananth,

I came across your impressive portfolio website and I'm interested in discussing a potential project with you.

Project Overview:
[Brief description of your project/requirements]

Timeline:
[Your expected timeline]

Budget Range:
[Your budget range if applicable]

Looking forward to hearing from you soon!

Best regards,
[Your Name]`;

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleDownloadResume = () => {
    // Create a link to the resume and trigger download
    const link = document.createElement('a');
    link.href = '/Ananth_Resume.docx';
    link.download = 'Ananth_Resume.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-black to-white/5 -z-10" />
      {/* 3D Elements and Background */}
      <motion.div 
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent" />
        
        {/* Animated grid */}
        <div className="grid grid-cols-6 grid-rows-8 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/5" />
          ))}
        </div>
        
        {/* 3D floating elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border-2 border-white/10 rounded-full animate-float-delay"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-white/10 rounded-full animate-float-slow"></div>
      </motion.div>

      <div className="section-container relative z-10">
        <motion.h2 
          className="section-title text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h2>
        
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Ready to turn your vision into reality? Let's create something extraordinary together
        </motion.p>
        
        <motion.div 
          className="max-w-2xl mx-auto mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={handleHireMe}
            className="px-10 py-5 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl text-xl font-bold text-white border-2 border-white/30 hover:border-white/60 transition-all duration-300 relative overflow-hidden group shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.35)]"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 60px rgba(255, 255, 255, 0.4), 0 0 100px rgba(255, 255, 255, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Send className="h-5 w-5" />
              Hire Me Now
            </span>
            <span className="absolute inset-0 rounded-3xl bg-white/10 blur-md animate-pulse" />
            <span className="absolute inset-1 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-white/10 backdrop-blur-sm"></span>
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-[shimmer_2s_ease-in-out_infinite]"></span>
          </motion.button>
          <motion.p 
            className="text-gray-400 mt-4 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.8 }}
          >
            *Opens your default email app with a pre-filled template
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form with enhanced animations */}
          <motion.div 
            className="bg-dark/40 backdrop-blur-sm rounded-xl p-8 lg:col-span-3 border border-white/10"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Send Me a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-light block">Your Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full bg-dark/50 border border-white/10 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 text-light transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-light block">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full bg-dark/50 border border-white/10 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 text-light transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-light block">Subject</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MessageSquare size={18} />
                  </div>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full bg-dark/50 border border-white/10 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 text-light transition-all"
                    placeholder="Project Inquiry"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-light block">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full bg-dark/50 border border-white/10 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 text-light resize-none transition-all"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="px-8 py-3 bg-white/10 rounded-md font-medium text-white border border-white/20 hover:bg-white/20 transition-all w-full md:w-auto relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={formStatus === 'submitting'}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {formStatus === 'idle' && (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                  {formStatus === 'submitting' && 'Sending...'}
                  {formStatus === 'success' && 'Message Sent!'}
                  {formStatus === 'error' && 'Please Try Again'}
                </span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity"></span>
              </motion.button>
              
              {formStatus === 'success' && (
                <motion.div 
                  className="text-green-400 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Thank you for reaching out! I'll get back to you soon.
                </motion.div>
              )}
              
              {formStatus === 'error' && (
                <motion.div 
                  className="text-red-400 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  There was an error sending your message. Please try again.
                </motion.div>
              )}
            </form>
          </motion.div>
          
          {/* Contact Info with enhanced animations */}
          <motion.div 
            className="bg-dark/40 backdrop-blur-sm rounded-xl p-8 lg:col-span-2 border border-white/10"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
            <div className="space-y-6">
              <motion.div 
                className="flex items-start gap-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  <Phone size={18} className="text-white" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-white">Phone</h4>
                  <p className="text-gray-300">+91 6384227309</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  <Mail size={18} className="text-white" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <p className="text-gray-300">thanan757@gmail.com</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  <MapPin size={18} className="text-white" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-white">Location</h4>
                  <p className="text-gray-300">Madurai, Tamil Nadu, India</p>
                </div>
              </motion.div>
            </div>
            
            {/* Social Links with enhanced animations */}
            <h3 className="text-xl font-bold mt-10 mb-6 text-white">Connect With Me</h3>
            <div className="flex gap-4">
              <motion.a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:text-white transition-all"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>
              
              <motion.a 
                href="https://github.com" 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:text-white transition-all"
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </motion.a>
              
              <motion.a 
                href="https://twitter.com" 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:text-white transition-all"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </motion.a>
              
              <motion.a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:text-white transition-all"
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>
            </div>
            
            {/* Resume Download with enhanced animation */}
            <div className="mt-10">
              <motion.button 
                onClick={handleDownloadResume}
                className="inline-flex items-center gap-2 px-6 py-3 border border-emerald-500 rounded-md font-medium text-light hover:bg-emerald-500/10 transition-all group relative overflow-hidden"
                whileHover={{ scale: 1.05, borderColor: "#10B981" }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                <span className="relative z-10">Download Resume</span>
                <span className="absolute inset-0 bg-emerald-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer with cinematic animation */}
      <footer className="mt-20 border-t border-emerald-500/20 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            © 2025 Ananth N. All Rights Reserved.
          </motion.p>
          <motion.p 
            className="text-gray-500 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Crafting digital experiences at the intersection of art and technology
          </motion.p>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
