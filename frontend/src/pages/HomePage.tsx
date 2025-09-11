import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Components
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import StatsSection from '@/components/StatsSection'
import TokenomicsSection from '@/components/TokenomicsSection'
import RoadmapSection from '@/components/RoadmapSection'
import CTA Section from '@/components/CTASection'
import TestimonialsSection from '@/components/TestimonialsSection'
import PartnersSection from '@/components/PartnersSection'

// Hooks
import { useScrollToTop } from '@/hooks/useScrollToTop'

const HomePage: React.FC = () => {
  useScrollToTop()

  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [tokenomicsRef, tokenomicsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [roadmapRef, roadmapInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [ctaRef, ctaInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [testimonialsRef, testimonialsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [partnersRef, partnersInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-panas-900/20 via-transparent to-algorand-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-panas-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-algorand-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" />
      </div>

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: heroInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSection />
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={featuresRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: featuresInView ? 1 : 0,
          y: featuresInView ? 0 : 50
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <FeaturesSection />
      </motion.div>

      {/* Stats Section */}
      <motion.div
        ref={statsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: statsInView ? 1 : 0,
          y: statsInView ? 0 : 50
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <StatsSection />
      </motion.div>

      {/* Tokenomics Section */}
      <motion.div
        ref={tokenomicsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: tokenomicsInView ? 1 : 0,
          y: tokenomicsInView ? 0 : 50
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <TokenomicsSection />
      </motion.div>

      {/* Roadmap Section */}
      <motion.div
        ref={roadmapRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: roadmapInView ? 1 : 0,
          y: roadmapInView ? 0 : 50
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <RoadmapSection />
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        ref={testimonialsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: testimonialsInView ? 1 : 0,
          y: testimonialsInView ? 0 : 50
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <TestimonialsSection />
      </motion.div>

      {/* Partners Section */}
      <motion.div
        ref={partnersRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: partnersInView ? 1 : 0,
          y: partnersInView ? 0 : 50
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <PartnersSection />
      </motion.div>

      {/* CTA Section */}
      <motion.div
        ref={ctaRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: ctaInView ? 1 : 0,
          y: ctaInView ? 0 : 50
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <CTASection />
      </motion.div>
    </div>
  )
}

export default HomePage
