import { getAddress as toChecksumAddress } from 'ethers';

export type PanasTokenConfig = {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply?: bigint | number | string;
  manager: string;
  network?: string;
  rpcUrl?: string;
  explorerUrl?: string;
  testHooks?: {
    forceDeployFail?: boolean;
    forceTransferFail?: boolean;
    forceMintFail?: boolean;
    forceBurnFail?: boolean;
  };
};

export type NetworkConfig = {
  network: string;
  rpcUrl: string;
  explorerUrl: string;
};

export class PanasToken {
  private cfg: PanasTokenConfig;
  private totalSupply: bigint;
  private signer?: unknown;

  constructor(cfg: PanasTokenConfig) {
    if (!cfg?.manager) {
      throw new Error('Manager address is required');
    }
    if (!PanasToken.isValidAddress(cfg.manager)) {
      throw new Error('Invalid manager address');
    }

    this.cfg = cfg;
    const init = cfg.initialSupply ?? 0n;
    this.totalSupply = BigInt(init);
  }

  static validateConfig(
    cfg: Partial<PanasTokenConfig>,
    opts: { throwOn?: Array<'manager' | 'name' | 'symbol' | 'decimals'> } = {}
  ): boolean {
    const throwOn = new Set(opts.throwOn ?? []);
    const errs: string[] = [];

    if (!cfg.name) {
      if (throwOn.has('name')) throw new Error('Invalid token name');
      errs.push('name');
    }
    if (!cfg.symbol) {
      if (throwOn.has('symbol')) throw new Error('Invalid token symbol');
      errs.push('symbol');
    }
    if (cfg.decimals == null || Number.isNaN(Number(cfg.decimals))) {
      if (throwOn.has('decimals')) throw new Error('Invalid token decimals');
      errs.push('decimals');
    }
    if (!cfg.manager || !PanasToken.isValidAddress(String(cfg.manager))) {
      if (throwOn.has('manager')) throw new Error('Invalid manager');
      errs.push('manager');
    }
    return errs.length === 0;
  }

  getTokenInfo() {
    const { name, symbol, decimals } = this.cfg;
    const supply = this.totalSupply;
    const formattedSupply = PanasToken.formatUnits(supply, decimals ?? 0);
    return { name, symbol, decimals, totalSupply: supply, formattedSupply };
  }

  getNetworkConfig(): NetworkConfig {
    const net = this.cfg.network ?? 'local';
    const rpcUrl =
      this.cfg.rpcUrl ??
      ({
        mainnet: 'https://rpc.ankr.com/eth',
        sepolia: 'https://rpc.sepolia.org',
        bsc: 'https://bsc-dataseed.binance.org',
        'bsc-testnet': 'https://data-seed-prebsc-1-s1.binance.org:8545',
        local: 'http://127.0.0.1:8545'
      } as Record<string, string>)[net] ??
      'http://127.0.0.1:8545';

    const explorerUrl =
      this.cfg.explorerUrl ??
      ({
        mainnet: 'https://etherscan.io',
        sepolia: 'https://sepolia.etherscan.io',
        bsc: 'https://bscscan.com',
        'bsc-testnet': 'https://testnet.bscscan.com',
        local: 'http://localhost:8545/explorer'
      } as Record<string, string>)[net] ??
      'http://localhost:8545/explorer';

    return { network: net, rpcUrl, explorerUrl };
  }

  static isValidAddress(addr: string): boolean {
    if (typeof addr !== 'string') return false;
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) return false;
    try {
      toChecksumAddress(addr);
      return true;
    } catch {
      return false;
    }
  }

  private preflightDeploy(): { ok: boolean; reason?: string } {
    if (!this.cfg.manager) return { ok: false, reason: 'no-manager' };
    if (!PanasToken.isValidAddress(this.cfg.manager))
      return { ok: false, reason: 'invalid-manager' };
    if (this.cfg.testHooks?.forceDeployFail)
      return { ok: false, reason: 'forced-fail' };
    return { ok: true };
  }

  async deploy(opts: { dryRun?: boolean } = {}): Promise<{ address: string }> {
    const pf = this.preflightDeploy();
    if (!pf.ok) throw new Error(`Deployment preflight failed: ${pf.reason}`);
    if (opts.dryRun) throw new Error('Deployment blocked in dryRun');
    const fakeAddr = '0x' + '1'.repeat(40);
    return { address: fakeAddr };
  }

  static formatUnits(value: bigint, decimals: number): string {
    const d = Math.max(0, Number(decimals));
    const s = value.toString().padStart(d + 1, '0');
    const i = s.slice(0, -d) || '0';
    const f = d ? s.slice(-d) : '';
    return d ? `${i}.${f}` : i;
  }

  async transfer(from: string, to: string, amount: bigint) {
    if (amount == null || amount <= 0n) throw new Error('Invalid amount');
    if (!PanasToken.isValidAddress(from)) throw new Error('Invalid from');
    if (!PanasToken.isValidAddress(to)) throw new Error('Invalid to');
    if (this.cfg.testHooks?.forceTransferFail)
      throw new Error('Transfer simulated failure');
    return { ok: true };
  }

  async mint(to: string, amount: bigint) {
    if (amount == null || amount <= 0n) throw new Error('Invalid amount');
    if (!PanasToken.isValidAddress(to)) throw new Error('Invalid to');
    if (this.cfg.testHooks?.forceMintFail)
      throw new Error('Mint simulated failure');
    this.totalSupply += amount;
    return { ok: true, totalSupply: this.totalSupply };
  }

  async burn(from: string, amount: bigint) {
    if (amount == null || amount <= 0n) throw new Error('Invalid amount');
    if (!PanasToken.isValidAddress(from)) throw new Error('Invalid from');
    if (this.cfg.testHooks?.forceBurnFail)
      throw new Error('Burn simulated failure');
    if (this.totalSupply < amount) throw new Error('Insufficient supply');
    this.totalSupply -= amount;
    return { ok: true, totalSupply: this.totalSupply };
  }
}


