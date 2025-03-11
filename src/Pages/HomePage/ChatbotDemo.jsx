import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import camera from "../../assets/camera.webp";
import qrbg from "../../assets/qrbg.webp";
import WhatsAppQRCode from '../Chatbot/WhatsappQrCode';
import {whatsappURL}  from '../../Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Zap, Lock, Smartphone, Bot, Send, Globe, Code, Camera } from 'lucide-react';
import rightside from '../../assets/rightside.webp';
import { fastURL, djangoURL } from '../../api';

// Floating particle effect component
const Particle = ({ animate }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20"
    animate={animate}
    transition={{
      duration: Math.random() * 10 + 20,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
    style={{
      width: Math.random() * 40 + 15,
      height: Math.random() * 40 + 15,
      filter: 'blur(2px)',
    }}
  />
);

const ChatbotDemoSection = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 1280 });

  useEffect(() => {
    const newSocket = io(`${whatsappURL}`);
    setSocket(newSocket);
    const generatedSessionId = `*/` + Math.random().toString(36).substr(2, 9);
    setSessionId(generatedSessionId);
    localStorage.setItem('sessionId', generatedSessionId);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message && !isAuthenticated) {
        localStorage.setItem('homepageQRScanned', 'true');
        localStorage.setItem('chatbotContactPhone', message.contactPhone);
        navigate(`/demo/chatbot/`, {
          state: {
            contactPhone: message.contactPhone,
            fromHomepage: true,
            sessionId: sessionId
          }
        });
      }
    };

    socket.on('new-message', handleNewMessage);
    return () => socket.off('new-message', handleNewMessage);
  }, [socket, isAuthenticated, navigate, sessionId]);

  const handleDemoStart = () => {
    const text = `${sessionId} Hi! I'd like to learn more about your chatbot automation.`;
    window.location.href = `https://wa.me/+16194560588?text=${encodeURIComponent(text)}`;
  };

  const Particle = ({ animate }) => (
    <motion.div
      className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-emerald-400/20"
      animate={animate}
      transition={{
        duration: Math.random() * 10 + 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{
        width: Math.random() * 40 + 15,
        height: Math.random() * 40 + 15,
        filter: 'blur(2px)',
      }}
    />
  );

  return (
    <section className="relative py-32 bg-gradient-to-b from-gray-900 via-black to-gray-900 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <Particle
          key={i}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
          }}
        />
      ))}
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Experience The Tech
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Try our intelligent chatbot.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/3 max-w-md"
          >
            <Card className="bg-white/5 backdrop-blur-lg border-0">
              <CardContent className="p-8">
              <div className="w-192 h-192 text-blue-500 mb-6 mx-auto ml-auto"style={{width:'500px',height:'auto'  }}>
  <img src={rightside} alt="Right side" />
</div>


                <p className="text-gray-300 text-center text-lg">
                  Scan the QR code to start your interactive demo
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/3 max-w-md"
          >
            <Card className="bg-white/5 backdrop-blur-lg border-0">
              <CardContent className="p-8">
                {isMobile ? (
                  <motion.button
                    onClick={handleDemoStart}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-lg font-medium rounded-lg shadow-xl hover:opacity-90 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Demo Now
                  </motion.button>
                ) : (
                  <div className="bg-white p-6 rounded-xl shadow-2xl">
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-112 h-112">
                        <WhatsAppQRCode />
                      </div>
                    </div>
                  </div>

                )}
                <p className="mt-6 text-gray-300 text-center text-lg">
                  QR Code
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => navigate('/demo/chatbot')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-lg font-medium rounded-lg shadow-xl hover:opacity-90 transition-all duration-300 mr-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Web Demo
          </button>
          <button
            onClick={() => navigate('/blogs')}
            className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white text-lg font-medium rounded-lg shadow-xl hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatbotDemoSection;