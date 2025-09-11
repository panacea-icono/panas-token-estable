import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-primary pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">
            Dashboard
          </h1>
          <p className="text-text-secondary text-lg">
            Monitorea tu participación en el ecosistema PanasToken Estable
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Balance Total',
              value: '1,234.56',
              unit: 'PANAS',
              change: '+12.5%',
              changeType: 'positive',
              icon: Wallet,
              color: 'from-panas-500 to-algorand-500'
            },
            {
              title: 'Transacciones',
              value: '42',
              unit: 'hoy',
              change: '+8.2%',
              changeType: 'positive',
              icon: Activity,
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'Usuarios Activos',
              value: '1,234',
              unit: 'usuarios',
              change: '+5.1%',
              changeType: 'positive',
              icon: Users,
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Valor Total',
              value: '$12,345',
              unit: 'USD',
              change: '-2.3%',
              changeType: 'negative',
              icon: DollarSign,
              color: 'from-blue-500 to-cyan-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background-card border border-border-primary rounded-2xl p-6 hover:border-panas-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">
                {stat.title}
              </div>
              <div className="text-xs text-text-tertiary mt-1">
                {stat.unit}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background-card border border-border-primary rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">
                Precio del Token
              </h3>
              <button className="p-2 rounded-lg bg-background-hover hover:bg-border-primary transition-colors">
                <RefreshCw className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            <div className="h-64 bg-gradient-to-r from-panas-500/10 to-algorand-500/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-panas-400 mx-auto mb-2" />
                <p className="text-text-secondary">Gráfico de precios</p>
                <p className="text-sm text-text-tertiary">Próximamente</p>
              </div>
            </div>
          </motion.div>

          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-background-card border border-border-primary rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">
                Actividad Reciente
              </h3>
              <button className="p-2 rounded-lg bg-background-hover hover:bg-border-primary transition-colors">
                <RefreshCw className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            <div className="h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <p className="text-text-secondary">Gráfico de actividad</p>
                <p className="text-sm text-text-tertiary">Próximamente</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-background-card border border-border-primary rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-text-primary mb-6">
            Transacciones Recientes
          </h3>
          <div className="space-y-4">
            {[
              {
                type: 'Recibido',
                amount: '+100.00',
                unit: 'PANAS',
                from: '0x1234...5678',
                time: 'Hace 2 minutos',
                status: 'completed'
              },
              {
                type: 'Enviado',
                amount: '-50.00',
                unit: 'PANAS',
                to: '0x8765...4321',
                time: 'Hace 1 hora',
                status: 'completed'
              },
              {
                type: 'Pendiente',
                amount: '+25.00',
                unit: 'PANAS',
                from: '0x1111...2222',
                time: 'Hace 3 horas',
                status: 'pending'
              }
            ].map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background-hover rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'Recibido' ? 'bg-green-500/20' : 
                    tx.type === 'Enviado' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {tx.type === 'Recibido' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-400" />
                    ) : tx.type === 'Enviado' ? (
                      <ArrowDownRight className="w-5 h-5 text-red-400" />
                    ) : (
                      <RefreshCw className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-text-primary font-medium">
                      {tx.type}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {tx.from || tx.to}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    tx.type === 'Recibido' ? 'text-green-400' : 
                    tx.type === 'Enviado' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {tx.amount} {tx.unit}
                  </div>
                  <div className="text-sm text-text-tertiary">
                    {tx.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
