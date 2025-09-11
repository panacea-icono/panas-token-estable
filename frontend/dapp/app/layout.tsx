import './globals.css'
import { ReactNode } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

export const metadata = {
  title: 'PANAS — Índice Estable Multi-Activo',
  description: 'Token índice estable multi-cadena del ecosistema PANACEA',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-panas-bg text-panas-text antialiased">
        <TonConnectUIProvider manifestUrl={process.env.NEXT_PUBLIC_TON_MANIFEST_URL || ''}>
          {children}
        </TonConnectUIProvider>
      </body>
    </html>
  )
}
