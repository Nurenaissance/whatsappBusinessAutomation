import React from 'react';
import './Blogs.css'; // Importing CSS styles
import WhatsappChatbot from '../../assets/chatbot.webp';
import WhatsappEngage from '../../assets/WhatsappEngage.webp';
import BusinessGrowth from '../../assets/BusinessGrowth.webp';
import Feedback from '../../assets/Feedback.webp';
import MarketingSt from '../../assets/marketingStrat.webp';
import Segment from '../../assets/connection.webp';
import { motion, useScroll, useTransform } from 'framer-motion';
import Footer from '../footer';
const blogs = [ 
  {
    id: 1,
    title: "Top 10 WhatsApp Marketing Strategies for Small Businesses ",
    imageUrl:  MarketingSt ,
    link: "/blogs/marketing-strategy"
  },
 
  {
    id: 2,
    title: "Using Technology to Boost Business Outreach & Revenue",
    imageUrl: BusinessGrowth,
    link: "/blogs/business-outreach"
  },
  {
    id: 3,
    title: "Maximize Customer Engagement with WhatsApp",
    imageUrl: WhatsappEngage,
    link: "/blogs/whatsapp-engagement"
  },
  {
    id: 4,
    title: "How to Handle Customer Feedback via WhatsApp: Best Practices ",
    imageUrl: Feedback,
    link: "/blogs/customer-feedback"
  },
  {
    id: 5,
    title: "AI Chatbots: The Future of Customer Engagement on WhatsApp",
    imageUrl: WhatsappChatbot,
    link: "/blogs/chatbot"
  },

  {
    id: 6,
    title: "Segmenting & Personalizing User Experience for Increased Revenue",
    imageUrl: Segment,
    link: "/blogs/segmentation"
  },
];

const Blogs = () => {
  const FloatingElement = ({ children, yOffset = 20, duration = 3 }) => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, yOffset]);
  
    return (
      <motion.div
        style={{ y }}
        animate={{ y: [0, yOffset, 0] }}
        transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    );
  };
  return (
    <div>
    <div className="blogs-page" style={{backgroundColor:'green'}}>
      <h1 className="blogs-title font-gliker text-black">Our Latest Blogs</h1>
      <div className="blogs-container">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card" onClick={() => window.location.href = blog.link}>
            <img src={blog.imageUrl} alt={blog.title} className="blog-image" />
            <h2 className="blog-header">{blog.title}</h2>
          </div>
        ))}
      </div>
      </div>
      <Footer/>

    </div>
  );
};

export default Blogs;
