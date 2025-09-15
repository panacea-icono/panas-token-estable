import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [tokenPrice, setTokenPrice] = useState(1.0000)
  const [marketCap, setMarketCap] = useState(1250000)
  const [transactions, setTransactions] = useState(2847)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Simular cambios en tiempo real
      setTokenPrice(1.0000 + (Math.random() - 0.5) * 0.001)
      setMarketCap(prev => prev + Math.floor((Math.random() - 0.5) * 10000))
      setTransactions(prev => prev + Math.floor(Math.random() * 3))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Datos para gráficas
  const priceHistory = [
    { time: '00:00', price: 1.0002 },
    { time: '04:00', price: 0.9998 },
    { time: '08:00', price: 1.0005 },
    { time: '12:00', price: 0.9999 },
    { time: '16:00', price: 1.0001 },
    { time: '20:00', price: 1.0003 },
    { time: '24:00', price: tokenPrice }
  ]

  const blockchainData = [
    { name: 'Algorand', percentage: 35, color: '#00D4AA' },
    { name: 'Solana', percentage: 28, color: '#9945FF' },
    { name: 'BSC', percentage: 22, color: '#F3BA2F' },
    { name: 'TON', percentage: 15, color: '#0088CC' }
  ]

  const features = [
    {
      icon: '⚡',
      title: 'Multi-Blockchain',
      description: 'Soporte nativo para Algorand, Solana, BSC y TON con contratos inteligentes optimizados.',
      gradient: 'from-emerald-400 to-cyan-400'
    },
    {
      icon: '📊',
      title: 'Índice Fiat Inteligente',
      description: 'Cálculo automático basado en FX oficial, paralelo y USDT con actualizaciones en tiempo real.',
      gradient: 'from-blue-400 to-indigo-400'
    },
    {
      icon: '🛡️',
      title: 'Seguridad Avanzada',
      description: 'Respaldado por múltiples activos y colaterales con auditorías constantes.',
      gradient: 'from-violet-400 to-purple-400'
    },
    {
      icon: '🚀',
      title: 'Transacciones Instantáneas',
      description: 'Confirmaciones rápidas con costos mínimos gracias a la infraestructura optimizada.',
      gradient: 'from-orange-400 to-red-400'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300D4AA' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Mouse Follower */}
      <div 
        className="fixed w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              PANAS
            </div>
            <nav className="hidden md:flex space-x-12">
              {['Features', 'Charts', 'Stats'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="relative text-slate-300 hover:text-emerald-400 transition-all duration-300 font-medium group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-6 py-2 glass rounded-full text-emerald-400 text-sm font-semibold border border-emerald-400/30">
              🚀 Vite + React + TypeScript
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
            <span className="text-3d-glow bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-glow">
              PANAS
            </span>
            <br />
            <span className="text-4xl md:text-6xl lg:text-7xl font-light text-slate-300 text-3d-subtitle">
              Token Estable
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Token índice estable multi-activo respaldado por activos de blockchain premium. 
            La evolución del dinero digital respaldado por tecnología descentralizada.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <div className="relative px-8 py-4 glass rounded-2xl font-bold text-lg border border-emerald-400/50 text-emerald-400">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl"></div>
              <span className="relative flex items-center gap-3">
                ✅ Sistema Operativo
              </span>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-mono text-cyan-400 mb-1">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-slate-500">Tiempo Real</div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Dashboard */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass border border-emerald-500/20 rounded-2xl p-6">
              <div className="text-slate-400 text-sm mb-2">Precio Actual</div>
              <div className="text-3xl font-bold text-emerald-400">${tokenPrice.toFixed(4)}</div>
              <div className="text-xs text-emerald-500 mt-1">+0.0001% (24h)</div>
            </div>
            <div className="glass border border-cyan-500/20 rounded-2xl p-6">
              <div className="text-slate-400 text-sm mb-2">Market Cap</div>
              <div className="text-3xl font-bold text-cyan-400">${marketCap.toLocaleString()}</div>
              <div className="text-xs text-cyan-500 mt-1">+2.5% (24h)</div>
            </div>
            <div className="glass border border-violet-500/20 rounded-2xl p-6">
              <div className="text-slate-400 text-sm mb-2">Transacciones</div>
              <div className="text-3xl font-bold text-violet-400">{transactions.toLocaleString()}</div>
              <div className="text-xs text-violet-500 mt-1">+15% (24h)</div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="glass border border-slate-700/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Historial de Precio (24h)</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {priceHistory.map((point, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-t transition-all duration-500 hover:from-emerald-400 hover:to-cyan-300 cursor-pointer"
                    style={{ height: `${(point.price - 0.999) * 2000}px` }}
                    title={`${point.time}: $${point.price.toFixed(4)}`}
                  ></div>
                  <div className="text-xs text-slate-400 mt-2">{point.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent text-3d-header">
                Características
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Tecnología de vanguardia para el futuro del dinero digital
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative glass border border-slate-700/50 rounded-3xl p-8 hover:scale-105 cursor-pointer transition-all duration-700"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 animate-float">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-emerald-400 group-hover:text-white transition-colors duration-300 text-3d-card">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blockchain Distribution Chart */}
      <section id="charts" className="relative py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent text-3d-header">
                Distribución Blockchain
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Distribución de activos respaldados por blockchain
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="glass border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Distribución por Blockchain</h3>
              <div className="space-y-4">
                {blockchainData.map((blockchain, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full animate-pulse"
                        style={{ backgroundColor: blockchain.color }}
                      ></div>
                      <span className="text-slate-300 font-medium">{blockchain.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${blockchain.percentage}%`,
                            backgroundColor: blockchain.color 
                          }}
                        ></div>
                      </div>
                      <span className="text-slate-400 font-mono w-12 text-right">{blockchain.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Métricas en Tiempo Real</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Volatilidad</span>
                  <span className="text-emerald-400 font-bold">0.001%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Liquidez Total</span>
                  <span className="text-cyan-400 font-bold">$2.5M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Transacciones/h</span>
                  <span className="text-violet-400 font-bold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Última Actualización</span>
                  <span className="text-teal-400 font-bold">{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-700/50 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-4">
              PANAS Token Estable
            </div>
            <p className="text-slate-400 text-lg">La evolución del dinero digital</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Desarrollado con Vite + React + TypeScript
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              Powered by Tailwind CSS
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
              Optimizado para Vercel
            </div>
          </div>
          
          <p className="text-slate-500 text-sm">
            &copy; 2024 Panacea Icono S.A. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App