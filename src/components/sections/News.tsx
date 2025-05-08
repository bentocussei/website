"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import newsData from "@/data/news.json";

// Define the type for a news item
interface NewsItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string;
}

// Mock data for news stories was moved to data/news.json

const News = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [visibleCards, setVisibleCards] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Determine number of visible cards based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCards(3); // Desktop: 3 cards
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2); // Tablet: 2 cards
      } else {
        setVisibleCards(1); // Mobile: 1 card
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    const maxIndex = newsData.length - visibleCards;
    setCurrentIndex((prevIndex) => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    const maxIndex = newsData.length - visibleCards;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  const openNewsDialog = (news: NewsItem) => {
    setSelectedNews(news);
  };

  const closeNewsDialog = () => {
    setSelectedNews(null);
  };

  // Function to create placeholder for missing images
  const getImageUrl = (path: string) => {
    // In a real app, you'd return the actual path
    // For this demo, we'll return a placeholder
    return `https://placehold.co/400x300/2563eb/FFFFFF?text=${path.split('/').pop()?.split('.')[0] || 'placeholder'}`;
  };

  // Share functions
  const shareOnLinkedIn = (news: NewsItem) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(news.title);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
  };

  const shareOnTwitter = (news: NewsItem) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${news.title} - Ratotecki News`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  return (
    <section id="news" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Latest News
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-xl text-gray-700 dark:text-gray-300">
            Stay updated with the latest developments and achievements at Ratotecki
          </p>
        </div>

        {/* News Carousel */}
        <div className="relative px-4">
          <div 
            ref={carouselRef} 
            className="overflow-hidden mx-auto max-w-7xl"
          >
            <div 
              className="flex flex-wrap md:flex-nowrap gap-8 transition-all duration-500"
              style={{
                transform: `translateX(-${currentIndex * (100 / Math.max(1, newsData.length - (visibleCards - 1)))}%)`,
              }}
            >
              {newsData.map((news) => (
                <motion.div 
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`flex-shrink-0 w-full ${
                    visibleCards === 3 ? 'md:w-[32%]' : 
                    visibleCards === 2 ? 'md:w-[48%]' : 
                    'md:w-full'
                  } bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col`}
                >
                  <div className="h-48 bg-blue-100 dark:bg-blue-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-blue-500 dark:text-blue-300 text-lg font-semibold">
                      {/* This would be an actual image in production */}
                      {news.title}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">{news.date}</span>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">{news.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">{news.summary}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => openNewsDialog(news)}
                      >
                        Read More
                      </Button>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => shareOnLinkedIn(news)} 
                          className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                          aria-label="Share on LinkedIn"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => shareOnTwitter(news)} 
                          className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                          aria-label="Share on Twitter"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevSlide}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* News Detail Dialog */}
        <AnimatePresence>
          {selectedNews && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={closeNewsDialog}
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">{selectedNews.date}</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">{selectedNews.title}</h3>
                    </div>
                    <button 
                      onClick={closeNewsDialog}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                      aria-label="Close"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  {/* News Hero Image */}
                  <div className="h-64 md:h-80 bg-blue-100 dark:bg-blue-900 mb-6 rounded-lg relative">
                    <div className="absolute inset-0 flex items-center justify-center text-blue-500 dark:text-blue-300 text-2xl font-semibold">
                      {/* This would be an actual image in production */}
                      {selectedNews.title}
                    </div>
                  </div>

                  {/* News Content */}
                  <div className="prose prose-blue dark:prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: selectedNews.content }} />

                  {/* Share Buttons */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" onClick={closeNewsDialog}>
                      Close
                    </Button>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700 dark:text-gray-300">Share:</span>
                      <button 
                        onClick={() => shareOnLinkedIn(selectedNews)} 
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        aria-label="Share on LinkedIn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => shareOnTwitter(selectedNews)} 
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        aria-label="Share on Twitter"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default News; 