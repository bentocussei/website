"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
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
            className="flex flex-col items-start space-y-6"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
            Bringing <span className="text-blue-600 dark:text-blue-400">Intelligence</span> to the Grid with AI and Virtual Twin.
            </h1>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
              Our AI-powered platform enables engineers to select, configure, and validate Intelligent Electronic Devices (IEDs) up to 10x faster using virtual twins.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button size="lg">
                Discover our solution
              </Button>
              <Button variant="outline" size="lg">
                Contact us
              </Button>
            </div>
          </motion.div>

          {/* Illustration/Image */}
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
        </div>

        {/* Stats or highlights strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 text-center z-10 relative"
        >
          {[
            { label: "Faster", value: "10x" },
            { label: "Fewer errors", value: "90%" },
            { label: "Early validation", value: "100%" },
            { label: "Higher reliability", value: "High" },
          ].map((stat, index) => (
            <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 