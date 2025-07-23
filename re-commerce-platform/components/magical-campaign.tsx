
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Users, Zap, Globe, Menu, X } from "lucide-react";
import Image from "next/image";
import { campaignLevels, getThemeClasses, type CampaignLevel } from "@/lib/campaign-data";
import MagicalParticles from "./magical-particles";
import LevelTransition from "./level-transition";
import EnhancedNavigation from "./enhanced-navigation";
import MagicalLoading from "./magical-loading";

export default function MagicalCampaign() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [nextLevel, setNextLevel] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const controls = useAnimation();

  // Initial loading simulation
  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(loadingInterval);
  }, []);

  // Auto-progression logic
  useEffect(() => {
    if (!isAutoPlaying || isLoading) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        const next = (currentLevel + 1) % campaignLevels.length;
        changeLevel(next);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isTransitioning, currentLevel, isLoading]);

  // Handle level change with magical transition
  const changeLevel = async (newLevel: number) => {
    if (newLevel === currentLevel || isTransitioning || isLoading) return;
    
    setIsTransitioning(true);
    setNextLevel(newLevel);
    setShowTransition(true);
    
    // Show transition overlay
    setTimeout(() => {
      setShowTransition(false);
      setCurrentLevel(newLevel);
      setIsTransitioning(false);
    }, 2000);
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const currentCampaign = campaignLevels[currentLevel];
  const themeClasses = getThemeClasses(currentCampaign);

  const getLevelIcon = (level: CampaignLevel) => {
    const iconProps = { className: "w-6 h-6" };
    switch (level.key) {
      case "verktygslada": return <Sparkles {...iconProps} />;
      case "hjalten": return <Zap {...iconProps} />;
      case "imperium": return <Users {...iconProps} />;
      case "onestopshop": return <Globe {...iconProps} />;
      default: return <Sparkles {...iconProps} />;
    }
  };

  if (isLoading) {
    return <MagicalLoading isVisible={isLoading} progress={loadingProgress} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Particles Background */}
      <MagicalParticles theme={currentCampaign.key} isTransitioning={isTransitioning} />
      
      {/* Level Transition Overlay */}
      <LevelTransition 
        isVisible={showTransition} 
        currentLevel={currentLevel} 
        nextLevel={nextLevel} 
      />

      {/* Enhanced Navigation - Desktop */}
      <div className="hidden lg:block">
        <EnhancedNavigation
          currentLevel={currentLevel}
          totalLevels={campaignLevels.length}
          onLevelChange={changeLevel}
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel}
          initial={{ opacity: 0, scale: 1.05, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`min-h-screen ${themeClasses.background}`}
        >
          {/* Mobile Navigation Header */}
          <motion.header 
            className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/20 lg:hidden"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="px-4 py-3 flex justify-between items-center">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-8 h-8 rounded-lg ${themeClasses.button.primary} flex items-center justify-center text-white`}>
                  {getLevelIcon(currentCampaign)}
                </div>
                <div>
                  <h1 className={`text-lg font-bold ${themeClasses.text.primary}`}>
                    re:Commerce
                  </h1>
                  <p className={`text-xs ${themeClasses.text.secondary}`}>
                    Nivå {currentLevel + 1}
                  </p>
                </div>
              </motion.div>

              <motion.button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? 
                  <X className="w-5 h-5 text-gray-700" /> : 
                  <Menu className="w-5 h-5 text-gray-700" />
                }
              </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  className="bg-white/10 backdrop-blur-md border-t border-white/20"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 space-y-2">
                    {campaignLevels.map((level, index) => (
                      <motion.button
                        key={level.id}
                        onClick={() => {
                          changeLevel(index);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                          index === currentLevel 
                            ? `${themeClasses.button.primary} text-white` 
                            : "bg-white/10 text-gray-700 hover:bg-white/20"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          {getLevelIcon(level)}
                          <div>
                            <div className="font-semibold">Nivå {index + 1}</div>
                            <div className="text-sm opacity-80">{level.title}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                    
                    <motion.button
                      onClick={() => {
                        setIsAutoPlaying(!isAutoPlaying);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full p-3 rounded-lg text-center transition-all duration-300 ${
                        isAutoPlaying
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-white/10 text-gray-700 border border-white/20"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isAutoPlaying ? "Auto-Play: PÅ" : "Auto-Play: AV"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>

          {/* Main Content */}
          <motion.main 
            className="pt-20 lg:pt-16 pb-12 px-4 lg:px-6"
            animate={controls}
          >
            <div className="max-w-7xl mx-auto">
              {/* Hero Section */}
              <motion.section 
                className="mb-12 lg:mb-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    >
                      <motion.h2 
                        className={`text-4xl md:text-5xl lg:text-7xl font-bold ${themeClasses.text.primary} mb-4`}
                        animate={{ 
                          textShadow: [
                            "0 0 0px rgba(0,0,0,0)",
                            "0 0 20px rgba(0,0,0,0.3)",
                            "0 0 0px rgba(0,0,0,0)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        NIVÅ {currentCampaign.id}
                      </motion.h2>
                      <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${themeClasses.text.primary} mb-4 lg:mb-6`}>
                        {currentCampaign.title}
                      </h3>
                      <p className={`text-lg md:text-xl ${themeClasses.text.secondary} mb-4 lg:mb-6`}>
                        {currentCampaign.subtitle}
                      </p>
                      <p className={`text-base lg:text-lg ${themeClasses.text.accent} leading-relaxed`}>
                        {currentCampaign.description}
                      </p>
                    </motion.div>

                    <motion.div
                      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                    >
                      <motion.button
                        className={`px-6 lg:px-8 py-3 lg:py-4 rounded-full text-white font-semibold text-base lg:text-lg ${themeClasses.button.primary} shadow-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {currentCampaign.cta}
                      </motion.button>
                      <motion.button
                        className={`px-6 lg:px-8 py-3 lg:py-4 rounded-full font-semibold text-base lg:text-lg ${themeClasses.button.secondary} transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Läs Mer
                      </motion.button>
                    </motion.div>
                  </div>

                  <motion.div
                    className="relative order-first lg:order-last"
                    initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
                      <Image
                        src={currentCampaign.heroImage}
                        alt={`${currentCampaign.title} hero image`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                    </div>
                    
                    {/* Floating magical elements */}
                    <motion.div
                      className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center"
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className={`w-6 h-6 lg:w-8 lg:h-8 ${themeClasses.text.primary}`} />
                    </motion.div>

                    {/* Additional floating elements */}
                    <motion.div
                      className="absolute -bottom-2 -left-2 w-8 h-8 lg:w-12 lg:h-12 bg-white/15 rounded-full backdrop-blur-sm flex items-center justify-center"
                      animate={{ 
                        y: [0, 8, 0],
                        x: [0, 5, 0],
                        scale: [1, 0.9, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    >
                      {getLevelIcon(currentCampaign)}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.section>

              {/* Features Grid */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <h4 className={`text-2xl lg:text-3xl font-bold ${themeClasses.text.primary} text-center mb-8 lg:mb-12`}>
                  Vad Ingår i {currentCampaign.title}
                </h4>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {currentCampaign.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      className={`p-4 lg:p-6 rounded-xl ${themeClasses.card} hover:shadow-xl transition-all duration-300`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 1.3 + (index * 0.1), 
                        duration: 0.6 
                      }}
                      whileHover={{ 
                        scale: 1.03,
                        y: -5,
                        rotateY: 5
                      }}
                    >
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg ${themeClasses.button.primary} flex items-center justify-center text-white mb-3 lg:mb-4`}>
                        {getLevelIcon(currentCampaign)}
                      </div>
                      <h5 className={`text-base lg:text-lg font-semibold ${themeClasses.text.primary} mb-2`}>
                        {feature}
                      </h5>
                      <p className={`${themeClasses.text.secondary} text-sm`}>
                        Kraftfull funktion som hjälper dig att uppnå dina mål snabbare och mer effektivt.
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Enterprise Compliance & Credibility Section */}
              <motion.section
                className="mt-12 lg:mt-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
              >
                <div className="text-center mb-8">
                  <h4 className={`text-xl lg:text-2xl font-bold ${themeClasses.text.primary} mb-4`}>
                    Enterprise-Grade Säkerhet & Compliance
                  </h4>
                  <p className={`${themeClasses.text.secondary} max-w-2xl mx-auto`}>
                    Byggd för svenska enterprise-krav med branschens högsta säkerhets- och compliance-standarder
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                  {/* GDPR Compliance Badge */}
                  <motion.div
                    className={`p-4 rounded-xl ${themeClasses.card} text-center hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">GDPR</span>
                    </div>
                    <p className={`${themeClasses.text.primary} text-xs font-semibold`}>
                      GDPR Compliant
                    </p>
                  </motion.div>

                  {/* BankID Integration Badge */}
                  <motion.div
                    className={`p-4 rounded-xl ${themeClasses.card} text-center hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.1, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">🔐</span>
                    </div>
                    <p className={`${themeClasses.text.primary} text-xs font-semibold`}>
                      BankID Ready
                    </p>
                  </motion.div>

                  {/* Swedish Flag Badge */}
                  <motion.div
                    className={`p-4 rounded-xl ${themeClasses.card} text-center hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-yellow-400 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">🇸🇪</span>
                    </div>
                    <p className={`${themeClasses.text.primary} text-xs font-semibold`}>
                      Svenska Regler
                    </p>
                  </motion.div>

                  {/* Enterprise Security */}
                  <motion.div
                    className={`p-4 rounded-xl ${themeClasses.card} text-center hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.3, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">🛡️</span>
                    </div>
                    <p className={`${themeClasses.text.primary} text-xs font-semibold`}>
                      Enterprise Säk.
                    </p>
                  </motion.div>

                  {/* Multi-Tenant */}
                  <motion.div
                    className={`p-4 rounded-xl ${themeClasses.card} text-center hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">🏢</span>
                    </div>
                    <p className={`${themeClasses.text.primary} text-xs font-semibold`}>
                      Multi-Tenant
                    </p>
                  </motion.div>

                  {/* WCAG Accessibility */}
                  <motion.div
                    className={`p-4 rounded-xl ${themeClasses.card} text-center hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-teal-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">♿</span>
                    </div>
                    <p className={`${themeClasses.text.primary} text-xs font-semibold`}>
                      WCAG 2.1 AA
                    </p>
                  </motion.div>
                </div>

                {/* Enterprise Stats */}
                <motion.div
                  className="mt-8 lg:mt-12 grid sm:grid-cols-3 gap-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.6, duration: 0.8 }}
                >
                  <div className={`p-6 rounded-xl ${themeClasses.card}`}>
                    <motion.div
                      className={`text-3xl lg:text-4xl font-bold ${themeClasses.text.primary} mb-2`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2.8, duration: 0.6, type: "spring" }}
                    >
                      4
                    </motion.div>
                    <p className={`${themeClasses.text.secondary} text-sm`}>
                      Kraftfulla System
                    </p>
                  </div>
                  <div className={`p-6 rounded-xl ${themeClasses.card}`}>
                    <motion.div
                      className={`text-3xl lg:text-4xl font-bold ${themeClasses.text.primary} mb-2`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 3.0, duration: 0.6, type: "spring" }}
                    >
                      54
                    </motion.div>
                    <p className={`${themeClasses.text.secondary} text-sm`}>
                      MD Utvecklingsfiler
                    </p>
                  </div>
                  <div className={`p-6 rounded-xl ${themeClasses.card}`}>
                    <motion.div
                      className={`text-3xl lg:text-4xl font-bold ${themeClasses.text.primary} mb-2`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 3.2, duration: 0.6, type: "spring" }}
                    >
                      100%
                    </motion.div>
                    <p className={`${themeClasses.text.secondary} text-sm`}>
                      Svenska Marknaden
                    </p>
                  </div>
                </motion.div>
              </motion.section>
            </div>
          </motion.main>

          {/* Bottom Navigation Controls - Mobile */}
          <motion.div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 lg:hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <motion.button
              onClick={() => changeLevel((currentLevel - 1 + campaignLevels.length) % campaignLevels.length)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </motion.button>

            <div className="flex space-x-1">
              {campaignLevels.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => changeLevel(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentLevel 
                      ? `bg-current ${themeClasses.text.primary}` 
                      : "bg-white/40"
                  }`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={() => changeLevel((currentLevel + 1) % campaignLevels.length)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </motion.button>
          </motion.div>

          {/* Gesture Navigation - Desktop */}
          <div className="hidden lg:block">
            <motion.button
              onClick={() => changeLevel((currentLevel - 1 + campaignLevels.length) % campaignLevels.length)}
              className="fixed left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 z-30"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </motion.button>

            <motion.button
              onClick={() => changeLevel((currentLevel + 1) % campaignLevels.length)}
              className="fixed right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 z-30"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Level Progress Indicator - Bottom */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-white/10 z-30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${
            currentCampaign.key === "verktygslada" ? "from-blue-500 to-blue-600" :
            currentCampaign.key === "hjalten" ? "from-amber-500 to-orange-600" :
            currentCampaign.key === "imperium" ? "from-purple-500 to-violet-600" :
            "from-slate-500 to-slate-600"
          }`}
          initial={{ width: "0%" }}
          animate={{ width: `${((currentLevel + 1) / campaignLevels.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
