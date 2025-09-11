// PanasToken Estable - Health Check Script
// Script para monitorear la salud del token y la red

import { Algodv2, Indexer } from 'algosdk';

interface HealthStatus {
  network: 'testnet' | 'mainnet';
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  metrics: {
    blockHeight: number;
    lastBlockTime: number;
    tokenSupply: number;
    activeAddresses: number;
    transactionCount: number;
  };
  alerts: string[];
}

export class TokenHealthMonitor {
  private algodClient: Algodv2;
  private indexer: Indexer;
  private assetId: number;
  private network: 'testnet' | 'mainnet';

  constructor(assetId: number, network: 'testnet' | 'mainnet') {
    this.assetId = assetId;
    this.network = network;
    
    const config = this.getNetworkConfig(network);
    this.algodClient = new Algodv2(
      config.algodToken,
      config.algodServer,
      config.algodPort
    );
    this.indexer = new Indexer(
      config.indexerToken,
      config.indexerServer,
      config.indexerPort
    );
  }

  async checkHealth(): Promise<HealthStatus> {
    const alerts: string[] = [];
    let status: 'healthy' | 'degraded' | 'down' = 'healthy';

    try {
      console.log(`🔍 Verificando salud del token ${this.assetId} en ${this.network}...`);

      // Verificar conectividad de la red
      const networkStatus = await this.checkNetworkStatus();
      if (!networkStatus.connected) {
        status = 'down';
        alerts.push('Red no disponible');
      }

      // Obtener métricas del token
      const metrics = await this.getTokenMetrics();
      
      // Verificar suministro del token
      if (metrics.tokenSupply <= 0) {
        status = 'degraded';
        alerts.push('Suministro del token es cero');
      }

      // Verificar actividad reciente
      const timeSinceLastBlock = Date.now() - metrics.lastBlockTime;
      if (timeSinceLastBlock > 300000) { // 5 minutos
        status = 'degraded';
        alerts.push('Último bloque hace más de 5 minutos');
      }

      // Verificar direcciones activas
      if (metrics.activeAddresses < 10) {
        alerts.push('Pocas direcciones activas');
      }

      const healthStatus: HealthStatus = {
        network: this.network,
        status,
        timestamp: new Date().toISOString(),
        metrics,
        alerts
      };

      this.logHealthStatus(healthStatus);
      return healthStatus;

    } catch (error) {
      console.error('❌ Error en health check:', error);
      return {
        network: this.network,
        status: 'down',
        timestamp: new Date().toISOString(),
        metrics: {
          blockHeight: 0,
          lastBlockTime: 0,
          tokenSupply: 0,
          activeAddresses: 0,
          transactionCount: 0
        },
        alerts: [`Error: ${error.message}`]
      };
    }
  }

  private async checkNetworkStatus(): Promise<{ connected: boolean; blockHeight: number }> {
    try {
      const status = await this.algodClient.status().do();
      return {
        connected: true,
        blockHeight: status['last-round']
      };
    } catch (error) {
      return {
        connected: false,
        blockHeight: 0
      };
    }
  }

  private async getTokenMetrics() {
    // Implementar obtención de métricas del token
    // Esto requeriría consultas al indexer
    return {
      blockHeight: 0,
      lastBlockTime: Date.now(),
      tokenSupply: 0,
      activeAddresses: 0,
      transactionCount: 0
    };
  }

  private getNetworkConfig(network: 'testnet' | 'mainnet') {
    if (network === 'testnet') {
      return {
        algodToken: '',
        algodServer: 'https://testnet-api.algonode.cloud',
        algodPort: 443,
        indexerToken: '',
        indexerServer: 'https://testnet-idx.algonode.cloud',
        indexerPort: 443,
      };
    } else {
      return {
        algodToken: '',
        algodServer: 'https://mainnet-api.algonode.cloud',
        algodPort: 443,
        indexerToken: '',
        indexerServer: 'https://mainnet-idx.algonode.cloud',
        indexerPort: 443,
      };
    }
  }

  private logHealthStatus(status: HealthStatus): void {
    const emoji = status.status === 'healthy' ? '✅' : status.status === 'degraded' ? '⚠️' : '❌';
    
    console.log(`${emoji} Estado del Token: ${status.status.toUpperCase()}`);
    console.log(`📊 Red: ${status.network}`);
    console.log(`🕐 Timestamp: ${status.timestamp}`);
    console.log(`📈 Métricas:`);
    console.log(`   - Altura del bloque: ${status.metrics.blockHeight}`);
    console.log(`   - Suministro del token: ${status.metrics.tokenSupply}`);
    console.log(`   - Direcciones activas: ${status.metrics.activeAddresses}`);
    console.log(`   - Transacciones: ${status.metrics.transactionCount}`);
    
    if (status.alerts.length > 0) {
      console.log(`🚨 Alertas:`);
      status.alerts.forEach(alert => console.log(`   - ${alert}`));
    }
  }
}

// Script ejecutable
if (import.meta.url === `file://${process.argv[1]}`) {
  const assetId = parseInt(process.argv[2]) || 0;
  const network = (process.argv[3] as 'testnet' | 'mainnet') || 'testnet';
  
  if (assetId === 0) {
    console.error('❌ Asset ID requerido');
    console.log('Uso: npm run health-check <asset-id> [testnet|mainnet]');
    process.exit(1);
  }

  const monitor = new TokenHealthMonitor(assetId, network);
  
  monitor.checkHealth()
    .then(status => {
      process.exit(status.status === 'down' ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}
