'use client'
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react'

export default function WalletPage() {
  const wallet = useTonWallet()
  const address = wallet?.account?.address
  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">Wallet</h1>
      <div className="mt-6">
        <TonConnectButton />
      </div>
      <div className="mt-4 text-panas-subtext">
        {address ? (
          <div>
            <div>Dirección conectada:</div>
            <div className="mt-1 font-mono text-sm">{address}</div>
          </div>
        ) : (
          <div>Conecta tu wallet TON para ver tu panel</div>
        )}
      </div>
    </div>
  )
}
