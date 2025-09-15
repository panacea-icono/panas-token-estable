'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [webhookStatus, setWebhookStatus] = useState('checking')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeFeature, setActiveFeature] = useState(0)
  const [tokenPrice, setTokenPrice] = useState(1.0000)
  const [marketCap, setMarketCap] = useState(1250000)
  const [transactions, setTransactions] = useState(2847)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Simular cambios en tiempo real
      setTokenPrice(1.0000 + (Math.random() - 0.5) * 0.001)
      setMarketCap(prev => prev + Math.floor((Math.random() - 0.5) * 10000))
      setTransactions(prev => prev + Math.floor(Math.random() * 3))
    }, 1000)

    const checkWebhook = async () => {
      try {
        const response = await fetch('/api/webhooks/vercel', { method: 'GET' })
        setWebhookStatus(response.ok ? 'active' : 'error')
      } catch {
        setWebhookStatus('error')
      }
    }

    checkWebhook()

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
      gradient: 'from-emerald-400 to-cyan-400',
      bgPattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]'
    },
    {
      icon: '📊',
      title: 'Índice Fiat Inteligente',
      description: 'Cálculo automático basado en FX oficial, paralelo y USDT con actualizaciones en tiempo real.',
      gradient: 'from-blue-400 to-indigo-400',
      bgPattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]'
    },
    {
      icon: '🛡️',
      title: 'Seguridad Avanzada',
      description: 'Respaldado por múltiples activos y colaterales con auditorías constantes.',
      gradient: 'from-violet-400 to-purple-400',
      bgPattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]'
    },
    {
      icon: '🚀',
      title: 'Transacciones Instantáneas',
      description: 'Confirmaciones rápidas con costos mínimos gracias a la infraestructura optimizada.',
      gradient: 'from-orange-400 to-red-400',
      bgPattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_50%)]'
    },
    {
      icon: '🌐',
      title: 'Interoperabilidad',
      description: 'Conectividad entre múltiples blockchains para máxima flexibilidad.',
      gradient: 'from-pink-400 to-rose-400',
      bgPattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%)]'
    },
    {
      icon: '📈',
      title: 'Estabilidad Garantizada',
      description: 'Algoritmos avanzados mantienen la estabilidad independientemente del mercado.',
      gradient: 'from-teal-400 to-emerald-400',
      bgPattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]'
    }
  ]

  const stats = [
    { number: '4', label: 'Blockchains', suffix: '+', delay: 0 },
    { number: '24', label: 'Monitoreo', suffix: '/7', delay: 100 },
    { number: '100', label: 'Transparencia', suffix: '%', delay: 200 },
    { number: '0.1', label: 'Confirmación', suffix: 's', delay: 300 }
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              PANAS
            </div>
            <nav className="hidden md:flex space-x-12">
              {['Features', 'Charts', 'Stats'].map((item, index) => (
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
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 rounded-full text-emerald-400 text-sm font-semibold backdrop-blur-sm">
              🚀 Next.js React Dinámico
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              PANAS
            </span>
            <br />
            <span className="text-4xl md:text-6xl lg:text-7xl font-light text-slate-300">
              Token Estable
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Token índice estable multi-activo respaldado por activos de blockchain premium. 
            La evolución del dinero digital respaldado por tecnología descentralizada.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <div className={`relative px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm border transition-all duration-500 ${
              webhookStatus === 'active' 
                ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/50 text-emerald-400' 
                : webhookStatus === 'error' 
                ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50 text-red-400'
                : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-cyan-400'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-current/10 to-transparent rounded-2xl"></div>
              <span className="relative flex items-center gap-3">
                {webhookStatus === 'active' ? '✅' : webhookStatus === 'error' ? '❌' : '⏳'}
                {webhookStatus === 'active' ? 'Sistema Operativo' : 
                 webhookStatus === 'error' ? 'Error de Conexión' : 'Verificando...'}
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
            <div className="bg-slate-900/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
              <div className="text-slate-400 text-sm mb-2">Precio Actual</div>
              <div className="text-3xl font-bold text-emerald-400">${tokenPrice.toFixed(4)}</div>
              <div className="text-xs text-emerald-500 mt-1">+0.0001% (24h)</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
              <div className="text-slate-400 text-sm mb-2">Market Cap</div>
              <div className="text-3xl font-bold text-cyan-400">${marketCap.toLocaleString()}</div>
              <div className="text-xs text-cyan-500 mt-1">+2.5% (24h)</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-6">
              <div className="text-slate-400 text-sm mb-2">Transacciones</div>
              <div className="text-3xl font-bold text-violet-400">{transactions.toLocaleString()}</div>
              <div className="text-xs text-violet-500 mt-1">+15% (24h)</div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
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
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Características
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Tecnología de vanguardia para el futuro del dinero digital
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-3xl p-8 border transition-all duration-700 hover:scale-105 cursor-pointer ${
                  activeFeature === index 
                    ? 'bg-slate-800/50 border-emerald-400/50' 
                    : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className={`absolute inset-0 ${feature.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-emerald-400 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
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
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Distribución Blockchain
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Distribución de activos respaldados por blockchain
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Distribución por Blockchain</h3>
              <div className="space-y-4">
                {blockchainData.map((blockchain, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
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
            
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
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

      {/* Stats */}
      <section id="stats" className="relative py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Estadísticas
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Números que respaldan nuestra tecnología
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="text-7xl md:text-8xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                    {stat.number}
                    <span className="text-4xl md:text-5xl">{stat.suffix}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </div>
                <div className="text-xl font-semibold text-slate-300 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Info */}
      <section id="tech" className="relative py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Técnico
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Configuración y estado del sistema
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Webhook Token', value: 'eIhe5OXfe9gq7SeUPHAD0Xpw', type: 'token' },
              { label: 'Vercel Project ID', value: 'prj_8V2CEf88FXnIGzRNW88nnXe6dDAU', type: 'id' },
              { label: 'API Key', value: 'zQH5Z6UcVPqS3n0taELmTeXs', type: 'key' },
              { label: 'Estado del Sistema', value: 'Operativo', type: 'status', status: 'success' },
              { label: 'Dominio Principal', value: 'panas.app', type: 'domain' },
              { label: 'Subdominio Token', value: 'token.panas.app', type: 'subdomain' }
            ].map((item, index) => (
              <div key={index} className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative">
                  <div className="text-slate-400 text-sm mb-3 font-medium">{item.label}</div>
                  <div className={`font-mono text-sm break-all ${
                    item.type === 'status' 
                      ? item.status === 'success' 
                        ? 'text-emerald-400' 
                        : 'text-red-400'
                      : 'text-white group-hover:text-emerald-400 transition-colors duration-300'
                  }`}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
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
              Desarrollado con Next.js y React
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              Desplegado en Vercel
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
              Powered by Tailwind CSS
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