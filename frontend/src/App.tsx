import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'

// Pages
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'
import TokenPage from '@/pages/TokenPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'

// Components
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'

// Hooks
import { useTheme } from '@/hooks/useTheme'

// Styles
import './index.css'

// Query client para React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

// Animaciones de página
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
}

function App() {
  const { theme } = useTheme()

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <Router>
          <div className="relative min-h-screen bg-background-primary text-text-primary">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <HomePage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <DashboardPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/token" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <TokenPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/about" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <AboutPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/contact" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ContactPage />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
            
            {/* Footer */}
            <Footer />
            
            {/* Loading Spinner */}
            <LoadingSpinner />
          </div>
        </Router>
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1e1e',
              color: '#ffffff',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </QueryClientProvider>
  )
}

export default App
