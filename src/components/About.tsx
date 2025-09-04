
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section 
      id="about" 
      className="min-h-screen py-16 bg-background relative"
      ref={ref}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground">
            Passionate developer and educator creating innovative solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Personal Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-2xl font-semibold text-foreground mb-4">My Journey</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  As a B.Com graduate turned passionate developer, I've found my calling in the 
                  world of technology and education. My journey started with curiosity and 
                  evolved into expertise.
                </p>
                <p>
                  Currently, I'm teaching <span className="text-primary font-semibold">150+ students</span> 
                  AI & BI in the Naan Mudhalvan program while serving as Campus Ambassador 
                  at Averixis Solutions.
                </p>
                <p>
                  I believe in learning by doing and teaching by sharing. Every project is 
                  an opportunity to grow and every student interaction makes me better.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Skills & Experience */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-2xl font-semibold text-foreground mb-4">What I Do</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-foreground">Full Stack Development</h4>
                    <p className="text-muted-foreground">Building modern web applications with React, Python, and TypeScript</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-foreground">AI/BI Education</h4>
                    <p className="text-muted-foreground">Teaching AI and Business Intelligence to 150+ students</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-foreground">Campus Leadership</h4>
                    <p className="text-muted-foreground">Campus Ambassador at Averixis Solutions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-foreground">AI Integration</h4>
                    <p className="text-muted-foreground">Prompt engineering and AI-powered application development</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 border text-center">
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Students Taught</div>
            </div>
            
            <div className="bg-card rounded-lg p-6 border text-center">
              <div className="text-3xl font-bold text-primary mb-2">5+</div>
              <div className="text-muted-foreground">Years Learning</div>
            </div>
            
            <div className="bg-card rounded-lg p-6 border text-center">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-muted-foreground">Lines of Code</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
