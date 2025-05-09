"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface DemoRequestData {
  name: string;
  email: string;
  company: string;
}

const Hero = () => {
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoFormData, setDemoFormData] = useState<DemoRequestData>({
    name: '',
    email: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Verificação inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDemoFormData({ ...demoFormData, [id.replace('demo-', '')]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simple validation
      if (!demoFormData.name || !demoFormData.email) {
        throw new Error('Please fill in all required fields');
      }

      // Send data to API
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      // Show success and reset form
      setSubmitSuccess(true);
      setDemoFormData({
        name: '',
        email: '',
        company: ''
      });

      // Close form after a delay
      setTimeout(() => {
        setShowDemoForm(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      {/* Background with gradient and wave effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-white dark:bg-gray-900 transform -skew-y-3 origin-bottom-right z-0"></div>
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Text content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col items-start space-y-6 ${isMobile ? 'mx-auto text-center items-center' : ''}`}
          >
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
            Bringing <span className="text-blue-600 dark:text-blue-400">Intelligence</span> to the Grid with AI and Virtual Twin.
            </h1>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
              Our AI-powered platform enables engineers to select, configure, and validate Intelligent Electronic Devices (IEDs) up to 10x faster using virtual twins.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button size="lg" onClick={() => setShowDemoForm(true)}>
                Request a Demo
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contact us
              </Button>
            </div>
          </motion.div>

          {/* Illustration/Image */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] lg:h-[500px] flex items-center justify-center"
            >
              <div className="absolute w-[80%] h-[80%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative w-full h-full">
                {/* Replace with a real company image when available */}
                <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-blue-600/20">
                  RATOTECKI
                </div>
                {/* Here we can put a real image, video, gif:
                <Image 
                  src="/hero-image.png" 
                  alt="Ratotecki Control System" 
                  fill
                  className="object-contain"
                  priority
                /> */}
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats or highlights strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 text-center z-10 relative"
        >
          {[
            { label: "Engineering time saved", value: "87.5%" },
            { label: "Minimizes operational risk", value: "Less Risk" },
            { label: "Faster project delivery", value: "2x" },
            { label: "Cost reduction per project", value: "87.5%" },
          ].map((stat, index) => (
            <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Demo Request Modal */}
      <AnimatePresence>
        {showDemoForm && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowDemoForm(false)}
            />
            
            {/* Modal */}
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  damping: 25
                }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Request a Demo</h3>
                  <button 
                    onClick={() => setShowDemoForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {submitSuccess && (
                    <div className="p-4 mb-4 bg-green-100 border border-green-400 text-green-700 rounded">
                      Your demo request has been submitted successfully!
                    </div>
                  )}
                  {submitError && (
                    <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
                      {submitError}
                    </div>
                  )}
                  <div>
                    <label htmlFor="demo-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="demo-name"
                      value={demoFormData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="demo-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="demo-email"
                      value={demoFormData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="demo-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company <span className="text-gray-500 dark:text-gray-400 text-sm font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="demo-company"
                      value={demoFormData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your company name"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero; 