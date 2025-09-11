import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Play, Star, Zap, Shield, Globe } from 'lucide-react'
import CountUp from 'react-countup'
import Tilt from 'react-parallax-tilt'

// Hooks
import { useTheme } from '@/hooks/useTheme'

const HeroSection: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { theme } = useTheme()
  
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-panas-500/30 to-algorand-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center px-4 py-2 rounded-full bg-panas-500/10 border border-panas-500/20 text-panas-400 text-sm font-medium mb-8"
        >
          <Star className="w-4 h-4 mr-2" />
          <span>Token Estable Oficial del Ecosistema PANAS</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-panas-400 via-algorand-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
            PanasToken
          </span>
          <br />
          <span className="text-white">
            Estable
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl lg:text-3xl text-text-secondary mb-8 max-w-4xl mx-auto leading-relaxed"
        >
          El futuro de las transacciones médicas y farmacéuticas está aquí.
          <br />
          <span className="text-panas-400 font-semibold">
            Estabilidad, velocidad y confiabilidad en la blockchain de Algorand.
          </span>
        </motion.p>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-panas-400 mb-2">
              <CountUp end={1000000000} duration={2.5} separator="," />
            </div>
            <div className="text-sm text-text-secondary">Suministro Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-algorand-400 mb-2">
              <CountUp end={4} duration={2.5} />s
            </div>
            <div className="text-sm text-text-secondary">Tiempo de Transacción</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">
              <CountUp end={99.9} duration={2.5} decimals={1} />%
            </div>
            <div className="text-sm text-text-secondary">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-pink-400 mb-2">
              <CountUp end={6} duration={2.5} />
            </div>
            <div className="text-sm text-text-secondary">Decimales</div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-panas-500 to-algorand-500 text-white font-semibold rounded-xl shadow-lg shadow-panas-500/25 hover:shadow-panas-500/40 transition-all duration-300"
            >
              <span className="flex items-center">
                Comenzar Ahora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-panas-600 to-algorand-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Tilt>

          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="group flex items-center px-8 py-4 bg-background-card border border-border-primary text-text-primary font-semibold rounded-xl hover:bg-background-hover transition-all duration-300"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Ver Demo
            </motion.button>
          </Tilt>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {[
            {
              icon: Zap,
              title: 'Transacciones Rápidas',
              description: 'Aprovecha la velocidad de Algorand con confirmaciones en 4 segundos',
              color: 'from-yellow-400 to-orange-500'
            },
            {
              icon: Shield,
              title: 'Máxima Seguridad',
              description: 'Protegido por la robusta blockchain de Algorand y auditorías de terceros',
              color: 'from-green-400 to-emerald-500'
            },
            {
              icon: Globe,
              title: 'Acceso Global',
              description: 'Disponible 24/7 en todo el mundo para el ecosistema médico',
              color: 'from-blue-400 to-cyan-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={floatingVariants}
              animate="animate"
              style={{ animationDelay: `${index * 0.5}s` }}
              className="group relative p-6 bg-background-card/50 backdrop-blur-sm border border-border-primary rounded-2xl hover:border-panas-500/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {feature.description}
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-panas-500/5 to-algorand-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text-secondary rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-text-secondary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
