import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Wallet } from 'lucide-react'
import { TonConnectButton } from '@tonconnect/ui-react'

export default function Page() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-panas-surface to-panas-bg" />
      <div className="absolute -z-10 inset-0 opacity-20">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
             style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(0,0,0,0) 60%)' }} />
      </div>

      <section className="container mx-auto px-6 py-24 flex flex-col items-center text-center">
        <motion.h1 className="text-4xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          PANAS — Índice Estable Multi-Activo para el ecosistema TON
        </motion.h1>
        <motion.p className="mt-6 max-w-3xl text-panas-subtext"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
          Respaldo cruzado: VASER (Solana), KUCHI (BSC), NF Domains (Algorand) y activos culturales.
          Paga en Telegram. Conecta tu wallet TON.
        </motion.p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <TonConnectButton className="!text-black" />
          <Link href="/docs" className="px-5 py-2 rounded-xl border border-panas-primary/40 text-panas-text hover:bg-panas-muted/40 transition">
            Leer Tokenomics
          </Link>
        </div>

        <motion.div className="mt-14 w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-brand"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-panas-subtext">NAV (WIP)</div>
              <div className="mt-1 text-3xl font-semibold">1.0000 PANAS</div>
              <div className="mt-1 text-emerald-400 text-sm">+0.42% 24h</div>
            </div>
            <Sparkles className="text-panas-primary" />
          </div>
          <div className="mt-4 text-xs text-panas-subtext">Rebalanceo cada 30 días • Drift ±5%</div>
        </motion.div>
      </section>
    </main>
  )
}
