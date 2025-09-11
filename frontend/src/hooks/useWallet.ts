import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: number
  network: 'testnet' | 'mainnet'
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
    network: 'testnet'
  })

  const [isLoading, setIsLoading] = useState(false)

  // Simular conexión de wallet (en producción usarías Algorand Wallet Connect)
  const connect = async () => {
    setIsLoading(true)
    
    try {
      // Simular delay de conexión
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular datos de wallet
      const mockAddress = 'ALGORAND_ADDRESS_' + Math.random().toString(36).substr(2, 9)
      const mockBalance = Math.random() * 1000
      
      setWallet({
        isConnected: true,
        address: mockAddress,
        balance: mockBalance,
        network: 'testnet'
      })
      
      toast.success('Wallet conectada exitosamente!')
    } catch (error) {
      toast.error('Error al conectar wallet')
      console.error('Wallet connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: 0,
      network: 'testnet'
    })
    
    toast.success('Wallet desconectada')
  }

  const switchNetwork = (network: 'testnet' | 'mainnet') => {
    setWallet(prev => ({
      ...prev,
      network
    }))
    
    toast.success(`Red cambiada a ${network}`)
  }

  const refreshBalance = async () => {
    if (!wallet.isConnected) return
    
    setIsLoading(true)
    
    try {
      // Simular actualización de balance
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newBalance = Math.random() * 1000
      setWallet(prev => ({
        ...prev,
        balance: newBalance
      }))
      
      toast.success('Balance actualizado')
    } catch (error) {
      toast.error('Error al actualizar balance')
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar si hay wallet conectada al cargar
  useEffect(() => {
    const savedWallet = localStorage.getItem('panas-wallet')
    if (savedWallet) {
      try {
        const parsedWallet = JSON.parse(savedWallet)
        setWallet(parsedWallet)
      } catch (error) {
        console.error('Error parsing saved wallet:', error)
      }
    }
  }, [])

  // Guardar estado de wallet
  useEffect(() => {
    if (wallet.isConnected) {
      localStorage.setItem('panas-wallet', JSON.stringify(wallet))
    } else {
      localStorage.removeItem('panas-wallet')
    }
  }, [wallet])

  return {
    ...wallet,
    isLoading,
    connect,
    disconnect,
    switchNetwork,
    refreshBalance
  }
}
