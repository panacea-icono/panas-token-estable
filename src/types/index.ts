// PanasToken Estable - Type Definitions
// Este directorio contendrá las definiciones de tipos TypeScript

export interface Wallet {
  address: string;
  mnemonic: string;
  privateKey: string;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface NetworkConfig {
  name: string;
  url: string;
  chainId: string;
  explorerUrl: string;
}
