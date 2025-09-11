import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Wallet, 
  User, 
  Settings,
  ChevronDown,
  Zap,
  Shield,
  Globe
} from 'lucide-react'

// Hooks
import { useTheme } from '@/hooks/useTheme'
import { useWallet } from '@/hooks/useWallet'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { isConnected, connect, disconnect, address } = useWallet()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Token', href: '/token' },
    { name: 'Acerca', href: '/about' },
    { name: 'Contacto', href: '/contact' }
  ]

  const features = [
    { icon: Zap, name: 'Velocidad', description: 'Transacciones en 4 segundos' },
    { icon: Shield, name: 'Seguridad', description: 'Blockchain de Algorand' },
    { icon: Globe, name: 'Global', description: 'Disponible 24/7' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background-primary/80 backdrop-blur-md border-b border-border-primary' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-r from-panas-500 to-algorand-500 rounded-xl flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">P</span>
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-text-primary group-hover:text-panas-400 transition-colors">
                PanasToken
              </div>
              <div className="text-xs text-text-secondary">
                Estable
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-panas-400'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.name}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-panas-500 to-algorand-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-background-card border border-border-primary text-text-secondary hover:text-text-primary hover:border-panas-500/50 transition-all duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Wallet Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsWalletOpen(!isWalletOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isConnected
                    ? 'bg-gradient-to-r from-panas-500 to-algorand-500 text-white'
                    : 'bg-background-card border border-border-primary text-text-primary hover:border-panas-500/50'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:block">
                  {isConnected ? 'Conectado' : 'Conectar Wallet'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              {/* Wallet Dropdown */}
              <AnimatePresence>
                {isWalletOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-background-card border border-border-primary rounded-xl shadow-xl overflow-hidden"
                  >
                    {isConnected ? (
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-panas-500 to-algorand-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-text-primary">
                              Wallet Conectada
                            </div>
                            <div className="text-xs text-text-secondary font-mono">
                              {address?.slice(0, 6)}...{address?.slice(-4)}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-hover rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                            <span>Configuración</span>
                          </button>
                          <button
                            onClick={() => {
                              disconnect()
                              setIsWalletOpen(false)
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Desconectar</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="text-center mb-4">
                          <div className="text-sm text-text-secondary mb-2">
                            Conecta tu wallet para comenzar
                          </div>
                          <div className="text-xs text-text-tertiary">
                            Soporta wallets de Algorand
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            connect()
                            setIsWalletOpen(false)
                          }}
                          className="w-full bg-gradient-to-r from-panas-500 to-algorand-500 text-white py-2 px-4 rounded-lg font-medium hover:from-panas-600 hover:to-algorand-600 transition-all duration-200"
                        >
                          Conectar Wallet
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg bg-background-card border border-border-primary text-text-secondary hover:text-text-primary hover:border-panas-500/50 transition-all duration-200"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background-card/50 backdrop-blur-md border-t border-border-primary">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.href
                        ? 'text-panas-400 bg-panas-500/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-hover'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Features */}
                <div className="pt-4 border-t border-border-primary">
                  <div className="text-xs text-text-tertiary mb-3 px-3">
                    Características
                  </div>
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary">
                      <feature.icon className="w-4 h-4 text-panas-400" />
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-xs text-text-tertiary">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
