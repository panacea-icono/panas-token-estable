import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PANAS Token Estable - Token Índice Multi-Activo',
  description: 'Token índice estable multi-activo respaldado por activos de blockchain premium',
  keywords: ['PANAS', 'token', 'estable', 'blockchain', 'Algorand', 'Solana', 'BSC'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
