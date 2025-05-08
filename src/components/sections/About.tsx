"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={variants}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            About Ratotecki
          </h2>
          <div className="w-20 h-1 bg-blue-600 mb-6"></div>
          <p className="max-w-3xl text-xl text-gray-700 dark:text-gray-300">
            Transforming how protection and control systems are engineered in the power and energy sector.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image or illustrative graphic */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] overflow-hidden rounded-xl shadow-xl"
          >
            <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
              <div className="text-blue-600 dark:text-blue-400 text-4xl font-bold">
                Virtual Twins & AI
              </div>
            </div>
            {/* Replace with image component when available 
            <Image 
              src="/about-image.jpg" 
              alt="Smart Grid Technology" 
              fill
              className="object-cover"
            /> */}
          </motion.div>

          {/* Descriptive text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Ratotecki</span> is transforming how protection and control systems are engineered in the power and energy sector.
            </p>

            <p className="text-lg text-gray-700 dark:text-gray-300">
              Our AI-powered platform enables engineers to select, configure, and validate Intelligent Electronic Devices (IEDs) such as relays, PLCs, and smart meters — up to 10x faster using virtual twins and real-time co-simulation.
            </p>

            <p className="text-lg text-gray-700 dark:text-gray-300">
              By automating complex configuration processes and enabling early validation, we help utilities and industrial players reduce errors, accelerate deployment, and improve system reliability — all while adapting to the challenges of a smarter, decentralized grid.
            </p>

            <div className="pt-6 flex flex-wrap gap-3">
              {['Artificial Intelligence', 'Software Simulation', 'Automation', 'AI Agents', 'Data-Driven Solutions'].map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 