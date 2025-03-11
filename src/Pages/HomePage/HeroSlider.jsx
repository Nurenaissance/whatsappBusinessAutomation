import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Bot, MessageSquare, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import your images and videos
import broadcast from '../../assets/4574.webp';
import whatsapp from '../../assets/slider/whatsapp.webp';
import flow from '../../assets/slider/flow.mp4';

const slides = [
  {
    title: "Transform Your Reach",
    description: "Imagine reaching thousands of eager customers with a single message. Our smart broadcasting turns every campaign into a conversation starter, delivering 5x higher engagement than traditional channels.",
    buttonText: "Start Broadcasting",
    icon: <Zap className="w-5 h-5" />,
    image: broadcast,
    link: "/register",
  },
  {
    title: "Ads That Click To Whatsapp",
    description: "Turn ads into instant conversations on WhatsApp, driving engagement and boosting conversions",
    buttonText: "Connect with Customers",
    accentColor: "from-yellow-400 to-yellow-600",
    image: whatsapp,
    link: "/register",
  },
  {
    title: "24/7 AI Assistant",
    description: "Let our AI handle customer queries around the clock. Automate responses, qualify leads, and book meetings without lifting a finger.",
    buttonText: "Meet Your Assistant",
    icon: <Bot className="w-5 h-5" />,
    video: flow,
    link: "/demo/chatbot",
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => paginate(1), 7000);
    return () => clearTimeout(timer);
  }, [page]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setPage((prevPage) => (prevPage + newDirection + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative bg-black overflow-hidden min-h-[calc(100vh-7rem)]">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/40 to-emerald-950/40" />
      
      {/* Hexagon pattern overlay */}
      <div className="absolute inset-0">
        <svg className="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="hexagons" width="8" height="14" patternUnits="userSpaceOnUse">
            <path d="M4 0l4 7-4 7H0l-4-7L0 0z" fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="0.2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="text-left">
              <div className="inline-block px-4 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/20">
                <p className="text-sm font-medium text-emerald-400">Featured</p>
              </div>

              <h2 className="text-5xl font-bold mb-6 leading-tight">
                <span className="text-white">{slides[page].title}</span>
              </h2>

              <p className="text-xl text-emerald-100/90 mb-8">
                {slides[page].description}
              </p>

              <button
                onClick={() => navigate(slides[page].link)}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:gap-4 shadow-lg shadow-emerald-500/20"
              >
                {slides[page].buttonText}
                {slides[page].icon}
              </button>
            </div>

            <div className="relative">
              {/* Subtle glow effect */}
              <div className="absolute -inset-4 bg-emerald-500/5 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20">
                {slides[page].video ? (
                  <video
                    src={slides[page].video}
                    className="w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={slides[page].image}
                    alt={slides[page].title}
                    className="w-full object-cover"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="max-w-6xl mx-auto mt-8 flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className="p-2 rounded-full bg-emerald-900/20 border border-emerald-500/20 hover:bg-emerald-900/40 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-emerald-400" />
          </motion.button>
          
          <div className="flex gap-3">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > page ? 1 : -1);
                  setPage(index);
                }}
                className={`w-12 h-1 rounded-full transition-all duration-300 ${
                  index === page 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                    : 'bg-emerald-900/20 border border-emerald-500/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className="p-2 rounded-full bg-emerald-900/20 border border-emerald-500/20 hover:bg-emerald-900/40 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6 text-emerald-400" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;