// PanasToken Estable - Smart Contracts
// Este directorio contendrá los contratos inteligentes de Algorand

export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
}

export class PanasToken {
  private config: TokenConfig;

  constructor(config: TokenConfig) {
    this.config = config;
  }

  getConfig(): TokenConfig {
    return this.config;
  }
}
