"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSwipeable } from "react-swipeable";

// Define the type for a news item (deve corresponder ao schema do Prisma e ao retorno da API)
interface NewsItem {
  id: string; // Prisma usa string para UUIDs
  title: string;
  date: string; // Manter como string conforme schema, mas idealmente seria DateTime
  summary: string;
  content: string;
  image: string | null; // Permitir nulo conforme schema (image?)
  createdAt: string; // Adicionar createdAt e updatedAt se precisar deles
  updatedAt: string;
}

const News = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]); // Estado para dados da API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [visibleCards, setVisibleCards] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Buscar dados da API ao montar o componente
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch news');
        }
        const data = await response.json();
        setNewsData(data.news || []); // API retorna { news: [...] }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching news.');
        setNewsData([]); // Limpar dados em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Check if we have news to display
  const hasNews = newsData.length > 0;

  // Determine number of visible cards based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (window.innerWidth >= 1280) { // Desktop grande / Laptop
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) { // Tablet / Laptop menor
        setVisibleCards(2);
      } else { // Mobile
        setVisibleCards(1);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Quando o número de cards visíveis mudar, assegure que o currentIndex é válido
  useEffect(() => {
    if (newsData.length === 0) return; // Não fazer nada se não há dados
    const maxIndex = Math.max(0, newsData.length > 0 ? newsData.length - visibleCards : 0);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCards, currentIndex, newsData.length]);

  const nextSlide = () => {
    if (!hasNews || newsData.length <= visibleCards) return;
    const maxIndex = Math.max(0, newsData.length - visibleCards);
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
  };

  const prevSlide = () => {
    if (!hasNews || newsData.length <= visibleCards) return;
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const openNewsDialog = (news: NewsItem) => {
    setSelectedNews(news);
  };

  const closeNewsDialog = () => {
    setSelectedNews(null);
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    trackMouse: false
  });

  // Function to create placeholder for missing images
  const getImageUrl = (imagePath: string | null, title: string) => {
    if (imagePath) {
      // Se imagePath for uma URL completa, use-a.
      // Se for um caminho relativo, prefixe com o necessário (ex: /images/)
      // Por enquanto, apenas retornando o caminho, assumindo que seja uma URL completa ou será tratado pelo componente Image do Next.js
      return imagePath;
    }
    // Placeholder se não houver imagem
    return `https://placehold.co/400x300/2563eb/FFFFFF?text=${encodeURIComponent(title.substring(0, 20))}`;
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

  const calculateTransform = () => {
    if (newsData.length === 0) return 'translateX(0%)';
    // No modo mobile, queremos saltar 100% para cada card
    if (visibleCards === 1) {
      return `translateX(-${currentIndex * 100}%)`;
    }
    // No modo desktop/tablet, calculamos proporcionalmente
    const itemWidth = visibleCards === 3 ? 33.33 : 50; // Largura aproximada de cada item em porcentagem
    return `translateX(-${currentIndex * itemWidth}%)`;
  };

  // If no news, and not loading and no error, hide the section or show a message
  if (isLoading) {
    return (
      <section id="news" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading News...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="news" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading News</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
        </div>
      </section>
    );
  }
  
  if (!hasNews && !isLoading) {
    return null; // Retorna null para não renderizar a seção
  }

  return (
    <section id="news" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-0 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Latest News
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300">
            Stay updated with the latest developments and achievements at Ratotecki
          </p>
        </div>

        {/* News Carousel */}
        <div className="relative w-full overflow-hidden">
          <div 
            className="w-full"
            {...swipeHandlers}
            ref={(el) => {
              // Atribuir ao nosso ref
              if (carouselRef.current !== el) {
                carouselRef.current = el;
              }
              // Aplicar o ref do swipeHandlers se existir
              if (swipeHandlers.ref) {
                swipeHandlers.ref(el);
              }
            }}
          >
            {isMobile && (
              <p className="text-sm text-center text-gray-500 mb-4 dark:text-gray-400 px-4">
                Swipe to navigate between news
              </p>
            )}
            <div 
              className="flex w-full"
              style={{
                transform: calculateTransform(),
                width: isMobile ? `${newsData.length * 100}%` : `${newsData.length * (100 / visibleCards)}%`,
                transition: 'transform 0.5s ease-in-out'
              }}
            >
              {newsData.map((news) => {
                const numNews = newsData.length;
                let dynamicStylesForCard: React.CSSProperties = {};

                if (isMobile) {
                  dynamicStylesForCard = {
                    width: '98%', // Estilo mobile original para largura e margens
                    marginLeft: '1%',
                    marginRight: '1%',
                    boxSizing: 'border-box',
                  };
                } else if (numNews > 0) {
                  // Para desktop/tablet, cada card ocupa 1/N da largura do track (incluindo margens)
                  const singleMarginPercentOfTrack = 0.5; // Equivalente a mx-[0.5%] do track
                  const totalMarginPercentOfTrack = 2 * singleMarginPercentOfTrack;
                  const cardInnerWidthPercentOfTrack = (100 / numNews) - totalMarginPercentOfTrack;

                  dynamicStylesForCard = {
                    width: `${cardInnerWidthPercentOfTrack}%`,
                    minWidth: `${cardInnerWidthPercentOfTrack}%`, // Garante que o card não encolha demais
                    marginLeft: `${singleMarginPercentOfTrack}%`,
                    marginRight: `${singleMarginPercentOfTrack}%`,
                    flexShrink: '0', // Essencial para que os cards não encolham
                  };
                }

                return (
                  <motion.div 
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col" // Classes base, largura e margens agora no style
                    style={dynamicStylesForCard}
                  >
                    <div className="h-48 bg-blue-100 dark:bg-blue-900 relative w-full">
                      {/* Idealmente, usar o componente Next/Image aqui se 'news.image' for um caminho gerenciável pelo Next.js */}
                      <img 
                        src={getImageUrl(news.image, news.title)} 
                        alt={news.title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { 
                          // Em caso de erro ao carregar a imagem original, pode-se tentar um placeholder
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Evitar loop infinito se o placeholder também falhar
                          target.src = `https://placehold.co/400x300/2563eb/FFFFFF?text=${encodeURIComponent(news.title.substring(0,15))}`;
                        }}
                      />
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow w-full">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">{news.date}</span>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white line-clamp-2 w-full">{news.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow w-full">{news.summary}</p>
                      
                      <div className="flex justify-between items-center mt-2 w-full">
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
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevSlide}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
              disabled={currentIndex === 0 || newsData.length <= visibleCards}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
              disabled={currentIndex >= Math.max(0, newsData.length - visibleCards) || newsData.length <= visibleCards}
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
                    {/* Idealmente, usar o componente Next/Image aqui */}
                    <img 
                      src={getImageUrl(selectedNews.image, selectedNews.title)} 
                      alt={selectedNews.title} 
                      className="w-full h-full object-cover rounded-lg" 
                      onError={(e) => { 
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        target.src = `https://placehold.co/800x400/2563eb/FFFFFF?text=${encodeURIComponent(selectedNews.title.substring(0,20))}`;
                      }}
                    />
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