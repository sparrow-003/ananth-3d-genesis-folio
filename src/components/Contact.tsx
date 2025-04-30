
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Mail, Phone, Send, User, MessageCircle } from 'lucide-react';

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
    const subject = "Interested in Hiring You";
    const body = `Hello Ananth,

I came across your impressive portfolio website and I'm interested in discussing a potential collaboration opportunity with you.

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

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-gradient-to-b from-dark/50 to-dark" ref={ref}>
      <motion.div 
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-purple/10 to-transparent" />
        <div className="grid grid-cols-6 grid-rows-8 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-purple/10" />
          ))}
        </div>
      </motion.div>

      <div className="section-container">
        <motion.h2 
          className="section-title text-center"
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
            className="px-10 py-5 bg-gradient-to-r from-purple to-purple-vibrant rounded-full text-xl font-bold text-white shadow-lg shadow-purple/30 hover:shadow-xl hover:shadow-purple/50 transition-all"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 25px rgba(155, 135, 245, 0.6)",
              textShadow: "0 0 8px rgba(255, 255, 255, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Send className="h-5 w-5" />
              Hire Me Now
            </span>
            <span className="absolute inset-0 rounded-full bg-white/10 blur-sm" />
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
            className="glass-card p-8 lg:col-span-3 border border-purple/20"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ boxShadow: "0 0 30px rgba(139, 92, 246, 0.15)" }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gradient">Send Me a Message</h3>
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
                      className="w-full bg-white/5 border border-gray-700 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple text-light transition-all"
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
                      className="w-full bg-white/5 border border-gray-700 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple text-light transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-light block">Subject</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MessageCircle size={18} />
                  </div>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full bg-white/5 border border-gray-700 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple text-light transition-all"
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
                  className="w-full bg-white/5 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple text-light resize-none transition-all"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="px-8 py-3 bg-purple rounded-md font-medium text-white shadow-lg shadow-purple/30 hover:bg-purple-vibrant transition-all w-full md:w-auto"
                whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                disabled={formStatus === 'submitting'}
              >
                <span className="flex items-center justify-center gap-2">
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
            className="glass-card p-8 lg:col-span-2 border border-purple/20"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ boxShadow: "0 0 30px rgba(139, 92, 246, 0.15)" }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gradient">Contact Information</h3>
            <div className="space-y-6">
              <motion.div 
                className="flex items-start gap-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.3)" }}
                >
                  <Phone size={18} className="text-purple" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-purple-light">Phone</h4>
                  <p className="text-gray-300">+91 6384227309</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.3)" }}
                >
                  <Mail size={18} className="text-purple" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-purple-light">Email</h4>
                  <p className="text-gray-300">thanan757@gmail.com</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.3)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </motion.div>
                <div>
                  <h4 className="font-semibold text-purple-light">Location</h4>
                  <p className="text-gray-300">Bangalore, India</p>
                </div>
              </motion.div>
            </div>
            
            {/* Social Links with enhanced animations */}
            <h3 className="text-xl font-bold mt-10 mb-6 text-gradient">Connect With Me</h3>
            <div className="flex gap-4">
              <motion.a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center hover:bg-purple hover:text-white transition-all"
                whileHover={{ scale: 1.2, rotate: 10, boxShadow: "0 0 15px rgba(139, 92, 246, 0.6)" }}
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
                className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center hover:bg-purple hover:text-white transition-all"
                whileHover={{ scale: 1.2, rotate: -10, boxShadow: "0 0 15px rgba(139, 92, 246, 0.6)" }}
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
                className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center hover:bg-purple hover:text-white transition-all"
                whileHover={{ scale: 1.2, rotate: 10, boxShadow: "0 0 15px rgba(139, 92, 246, 0.6)" }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </motion.a>
              
              <motion.a 
                href="#" 
                className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center hover:bg-purple hover:text-white transition-all"
                whileHover={{ scale: 1.2, rotate: -10, boxShadow: "0 0 15px rgba(139, 92, 246, 0.6)" }}
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
              <motion.a 
                href="#" 
                className="inline-flex items-center gap-2 px-6 py-3 border border-purple rounded-md font-medium text-light hover:bg-purple/10 transition-all group relative overflow-hidden"
                whileHover={{ scale: 1.05, borderColor: "#D6BCFA" }}
                whileTap={{ scale: 0.95 }}
                download
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span className="relative z-10">Download Resume</span>
                <span className="absolute inset-0 bg-purple/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer with cinematic animation */}
      <footer className="mt-20 border-t border-gray-800 pt-8">
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
