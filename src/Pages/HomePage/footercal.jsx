import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence,useScroll,useTransform } from 'framer-motion';
import { MessageSquare, Clock, Bot, Zap, ShoppingCart, HeartHandshake, Calendar, ArrowRight, ExternalLink, Users, Link, MessageCircle, Star, Shield, Rocket, Check } from 'lucide-react';
import { FaVolumeMute, FaVolumeUp, FaPlay } from "react-icons/fa";
import { PopupButton } from 'react-calendly';
import connection from "../../assets/connection.webp";
import chatbot from "../../assets/chatbot.webp";
import security from "../../assets/security.webp";
import outreach from "../../assets/outreach.webp";
import { Button } from "@/components/ui/button";
import Quick from '../../assets/quickresponse.webp';
import srRoyal from '../../assets/SR_Logo.webp';
import drishtee from '../../assets/drishte_logo.webp';
import gargi from '../../assets/gargi.webp'
import Scale from '../../assets/scale.webp';
import { useNavigate } from "react-router-dom";
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

const FloatingOrb = ({ className }) => (
  <motion.div
    className={`absolute w-64 h-64 rounded-full blur-3xl ${className}`}
    animate={{ 
      scale: [1, 1.2, 1],
      opacity: [0.1, 0.2, 0.1],
    }}
    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
  />
);



export const Footer = () => {
  const footerData = [
    {
      title: 'Product',
      links: [
        { name: 'Features', url: '/' },
        { name: 'Pricing', url: '/pricing' },
        { name: 'Case Studies', url: '/blogs' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', url: '/' },
        { name: 'Contact', url: '/contactus' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', url: '/privacypolicy' },
        { name: 'Terms of Service', url: '/termsandconditions' },
        { name: 'Refund & Cancellation', url: '/refundandcancellation' },
      ],
    },
  ];

  return (
    <footer className="py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      
      <FloatingElement yOffset={30} duration={5}>
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-10 blur-2xl" />
      </FloatingElement>
      <FloatingElement yOffset={-20} duration={4}>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-10 blur-2xl" />
      </FloatingElement>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-sm p-6 rounded-2xl border border-emerald-900/20"
          >
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent [text-shadow:0_4px_8px_rgba(0,255,128,0.1)]">
              Nuren AI
            </h3>
            <p className="text-emerald-100/80 text-lg">
              Revolutionizing WhatsApp business communication with AI-powered solutions.
            </p>
          </motion.div>
          
          {footerData.map((column, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="backdrop-blur-sm p-6 rounded-2xl border border-emerald-900/20"
            >
              <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent [text-shadow:0_2px_4px_rgba(0,255,128,0.1)]">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-lg text-gray-300 hover:text-emerald-300 transition-all duration-300 flex items-center group relative overflow-hidden"
                    >
                      <div className="absolute h-px w-full bg-gradient-to-r from-emerald-500 to-green-500 -bottom-px transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      <ExternalLink className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 pt-8 border-t border-emerald-900/30 text-center text-gray-400 text-lg"
        >
          <p>&copy; 2025 Nu Renaissance Fabrica Pvt Ltd. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};
import { Video } from 'lucide-react';
export const CalendlySection = () => {
    const benefits = [
      {
        icon: Clock,
        title: "30-Min Power Chat",
        description: "Quick, focused discussion about your needs"
      },
      {
        icon: Video,
        title: "Live Demo",
        description: "See our platform in action"
      },
      {
        icon: MessageSquare,
        title: "Custom Strategy",
        description: "Get personalized recommendations"
      }
    ];
  
    return (
      <section className="relative bg-black overflow-hidden py-24">
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
  
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/20 mb-4">
                <p className="text-sm font-medium text-emerald-400">Book a Demo</p>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
                Schedule a personalized demo with our founder and discover how we can help you scale
              </p>
            </motion.div>
  
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/20">
                      <benefit.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-emerald-100/80">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
  
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Glowing effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-2xl" />
                
                <div className="relative p-8 rounded-2xl bg-black/60 backdrop-blur-sm border border-emerald-500/20">
                  <div className="flex items-center gap-4 mb-6">
                    <Calendar className="w-8 h-8 text-emerald-400" />
                    <h3 className="text-2xl font-bold text-white">Schedule Your Demo</h3>
                  </div>
                  
                  <PopupButton
                    url="https://calendly.com/adarsh1885/schedule-a-demo"
                    rootElement={document.getElementById("root")}
                    text={
                      <span className="flex items-center justify-center gap-3 w-full">
                        FREE CONSULTATION
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                      </span>
                    }
                    className="group w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105"
                  />
  
                  <div className="mt-6 pt-6 border-t border-emerald-500/20">
                    <p className="text-emerald-100/80 text-sm text-center">
                      Join the growing community of businesses scaling with our solutions
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  


  import {  ChevronRight } from 'lucide-react';
  
  export const FeaturesSection = () => {
    const features = [
      { 
        icon: MessageCircle, 
        title: "AI-POWERED CHATBOTS", 
        description: "Automate customer interactions with intelligent chatbots that understand context and intent.", 
        link: 'blogs/chatbot',
        image: chatbot
      },
      { 
        icon: Users, 
        title: "ADVANCED SEGMENTATION", 
        description: "Target the right audience with precision using our advanced customer segmentation tools.", 
        link: 'blogs/segmentation',
        image: connection
      },
      { 
        icon: Zap, 
        title: "QUICK RESPONSES", 
        description: "Create and manage a library of quick responses to common queries, saving time and ensuring consistency.", 
        link: 'blogs/segmentation',
        image: Quick
      },
      { 
        icon: Star, 
        title: "PERSONALISED EXPERIENCES", 
        description: "Deliver tailored messages and recommendations based on customer behavior and preferences.", 
        link: 'blogs/whatsapp-engagement',
        image: outreach
      },
      { 
        icon: Shield, 
        title: "SECURE & COMPLIANT", 
        description: "Ensure data privacy and comply with regulations using our robust security measures.", 
        link: 'blogs/segmentation',
        image: security
      },
      { 
        icon: Rocket, 
        title: "SCALABLE SOLUTIONS", 
        description: "Grow your business effortlessly with our scalable WhatsApp marketing solutions, designed to boost engagement & sales. ", 
        link: 'blogs/segmentation',
        image: Scale
      },
    ];
  
    return (
      <div className="relative bg-black overflow-hidden min-h-[calc(100vh-7rem)]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/40 to-emerald-950/40" />
        
        <div className="absolute inset-0">
          <svg className="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="hexagons" width="8" height="14" patternUnits="userSpaceOnUse">
              <path d="M4 0l4 7-4 7H0l-4-7L0 0z" fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
  
        <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/20 mb-4">
                <p className="text-sm font-medium text-emerald-400">Our Features</p>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6">
                Powerful Tools for Growth
              </h2>
            </motion.div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.a
                  href={feature.link}
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div className="relative p-8 rounded-xl bg-black/50 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                    <div className="relative h-48 w-full mb-6 rounded-lg overflow-hidden">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-900/20 inline-block mb-4">
                      <feature.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-emerald-100/80">
                      {feature.description}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export const PricingSection = () => {
    const navigate = useNavigate();
  
    const handleGetStarted = () => {
      navigate('/pricing');
      // Scroll to top after navigation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
  
    const plans = [
      {
        plan: "Basic",
        price: "₹1,499",
        usdPrice: "$19",
        eurPrice: "€17",
        features: [
          "Scheduling messages",
          "No-code chatbot builder",
          "Cataloging",
          "Template creation",
          "Direct reply to individual chats",
          "Basic analytics dashboard",
          "Support for 2-3 languages",
          "24/7 reliability and support"
        ],
        popular: false
      },
      {
        plan: "Professional",
        price: "₹4,999",
        usdPrice: "$59",
        eurPrice: "€54",
        features: [
          "Everything in Basic, plus:",
          "Flows [RPA]",
          "AI-based document retrieval",
          "Phone number verification",
          "Carousel creation",
          "Multi-template campaigns",
          "Advanced analytics",
          "Full language support"
        ],
        popular: true
      },
      {
        plan: "Enterprise",
        price: "₹9,999",
        usdPrice: "$119",
        eurPrice: "€109",
        features: [
          "Everything in Professional, plus:",
          "AI prompt to chatbot builder",
          "WhatsApp payments",
          "Advanced team support",
          "API access",
          "24/7 priority support",
          "Custom onboarding",
          "Campaign A/B testing"
        ],
        popular: false
      }
    ];
  
    return (
      <section className="relative min-h-screen bg-black overflow-hidden py-24">
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
  
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/20 mb-4">
              <p className="text-sm font-medium text-emerald-400">Simple Pricing</p>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
              Powerful WhatsApp automation solutions for businesses of all sizes
            </p>
          </div>
  
          {/* Use flex to ensure equal height */}
          <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className="flex-1 group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur ${
                  plan.popular ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition duration-300`} />
                <div className={`relative h-full p-8 rounded-xl backdrop-blur-sm border ${
                  plan.popular ? 'bg-black/60 border-emerald-500/40' : 'bg-black/50 border-emerald-500/20'
                } transition-all duration-300`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500">
                        <p className="text-sm font-semibold text-white">Most Popular</p>
                      </div>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.plan}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-emerald-100/80">/month</span>
                  </div>
                  <div className="flex gap-2 mb-6">
                    <span className="text-sm text-emerald-100/60">{plan.usdPrice}/mo</span>
                    <span className="text-sm text-emerald-100/60">|</span>
                    <span className="text-sm text-emerald-100/60">{plan.eurPrice}/mo</span>
                  </div>
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3 text-emerald-100/80">
                        <Check className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleGetStarted}
                    className="w-full group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-semibold transition-all duration-300 hover:gap-4"
                  >
                    Get Started
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  export const SocialProofSection = () => {
    const companies = [
      {
        name: "SR Royal Enterprises",
        logo: srRoyal,
        testimonial: "Boosted customer response rates by 85% with AI automation, achieving 10% CTR and doubling lead generation.",
        industry: "Security & Detectives"
      },
      {
        name: "Drishtee Foundation",
        logo: drishtee,
        testimonial: "Scaled rural outreach to 10,000+ beneficiaries monthly, simplifying orders via WhatsApp and enabling regional language catalogs.",
        industry: "Non-Profit"
      },
      {
        name: "Gargi India",
        logo: gargi,
        testimonial: "Automated 90% of inquiries with 24/7 support, using WhatsApp to engage real estate clients through long sales cycles.",
        industry: "Real Estate"
      }
    ];
  
    return (
      <div className="relative bg-black overflow-hidden min-h-[calc(100vh-7rem)]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/40 to-emerald-950/40" />
        
        <div className="absolute inset-0">
          <svg className="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="hexagons" width="8" height="14" patternUnits="userSpaceOnUse">
              <path d="M4 0l4 7-4 7H0l-4-7L0 0z" fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
  
        <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/20 mb-4">
                <p className="text-sm font-medium text-emerald-400">Trusted By Leaders</p>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6">
                Empowering Businesses Across India
              </h2>
              <p className="text-xl text-emerald-100/90 max-w-2xl mx-auto">
                Join hundreds of businesses that have transformed their customer engagement with our AI-powered solutions
              </p>
            </motion.div>
  
            <div className="grid md:grid-cols-3 gap-8">
              {companies.map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div className="relative p-8 rounded-xl bg-black/50 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-32 h-32 mb-6 relative rounded-xl overflow-hidden bg-white p-4">
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{company.name}</h3>
                      <span className="text-sm text-emerald-400 mb-4">{company.industry}</span>
                      <p className="text-emerald-100/80">{company.testimonial}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
  
           
          </div>
        </div>
      </div>
    );
  }; 