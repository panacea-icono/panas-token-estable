// PanasToken Estable - Environment Setup
// Script para configurar el entorno de desarrollo

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface EnvironmentConfig {
  network: 'testnet' | 'mainnet';
  algodToken: string;
  algodServer: string;
  algodPort: number;
  indexerToken: string;
  indexerServer: string;
  indexerPort: number;
  walletMnemonic: string;
  managerAddress: string;
  reserveAddress: string;
  freezeAddress: string;
  clawbackAddress: string;
}

export class EnvironmentSetup {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.getDefaultConfig();
  }

  async setupEnvironment(): Promise<void> {
    console.log('🔧 Configurando entorno de desarrollo...');

    try {
      // Crear archivo .env si no existe
      await this.createEnvFile();
      
      // Crear directorios necesarios
      await this.createDirectories();
      
      // Configurar archivos de red
      await this.createNetworkConfigs();
      
      // Verificar dependencias
      await this.checkDependencies();
      
      console.log('✅ Entorno configurado exitosamente!');
      this.printNextSteps();
      
    } catch (error) {
      console.error('❌ Error configurando entorno:', error);
      throw error;
    }
  }

  private async createEnvFile(): Promise<void> {
    const envPath = '.env';
    
    if (existsSync(envPath)) {
      console.log('📄 Archivo .env ya existe, omitiendo...');
      return;
    }

    const envContent = `# PanasToken Estable - Environment Configuration
# Copia este archivo y configura las variables según tu entorno

# Network Configuration
ALGORAND_NETWORK=testnet
ALGOD_TOKEN=
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_PORT=443
INDEXER_TOKEN=
INDEXER_SERVER=https://testnet-idx.algonode.cloud
INDEXER_PORT=443

# Wallet Configuration (NUNCA commitees estos valores)
TESTNET_WALLET_MNEMONIC=
MAINNET_WALLET_MNEMONIC=

# Token Configuration
TOKEN_NAME=PanasToken Estable
TOKEN_SYMBOL=PANAS
TOKEN_DECIMALS=6
TOKEN_TOTAL_SUPPLY=1000000000
TOKEN_DESCRIPTION=Token estable del ecosistema PANAS
TOKEN_URL=https://github.com/panacea-icono/panas-token-estable

# Manager Addresses
TESTNET_MANAGER_ADDRESS=
MAINNET_MANAGER_ADDRESS=
TESTNET_RESERVE_ADDRESS=
MAINNET_RESERVE_ADDRESS=
TESTNET_FREEZE_ADDRESS=
MAINNET_FREEZE_ADDRESS=
TESTNET_CLAWBACK_ADDRESS=
MAINNET_CLAWBACK_ADDRESS=

# Test Configuration
TEST_ACCOUNT_MNEMONIC=

# Monitoring
HEALTH_CHECK_INTERVAL=300000
ALERT_WEBHOOK_URL=

# Security
SNYK_TOKEN=
`;

    writeFileSync(envPath, envContent);
    console.log('📄 Archivo .env creado');
  }

  private async createDirectories(): Promise<void> {
    const directories = [
      'logs',
      'data',
      'data/testnet',
      'data/mainnet',
      'data/backups',
      'contracts/compiled',
      'contracts/source',
      'tests/fixtures',
      'docs/api',
      'docs/deployment'
    ];

    for (const dir of directories) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
      }
    }
  }

  private async createNetworkConfigs(): Promise<void> {
    const testnetConfig = {
      name: 'Testnet',
      algodToken: '',
      algodServer: 'https://testnet-api.algonode.cloud',
      algodPort: 443,
      indexerToken: '',
      indexerServer: 'https://testnet-idx.algonode.cloud',
      indexerPort: 443,
      explorer: 'https://testnet.algoexplorer.io'
    };

    const mainnetConfig = {
      name: 'Mainnet',
      algodToken: '',
      algodServer: 'https://mainnet-api.algonode.cloud',
      algodPort: 443,
      indexerToken: '',
      indexerServer: 'https://mainnet-idx.algonode.cloud',
      indexerPort: 443,
      explorer: 'https://algoexplorer.io'
    };

    writeFileSync('config/networks/testnet.json', JSON.stringify(testnetConfig, null, 2));
    writeFileSync('config/networks/mainnet.json', JSON.stringify(mainnetConfig, null, 2));
    
    console.log('🌐 Configuraciones de red creadas');
  }

  private async checkDependencies(): Promise<void> {
    console.log('🔍 Verificando dependencias...');
    
    // Verificar Node.js
    const nodeVersion = process.version;
    console.log(`📦 Node.js: ${nodeVersion}`);
    
    // Verificar npm
    const { execSync } = await import('child_process');
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`📦 npm: ${npmVersion}`);
    
    // Verificar TypeScript
    try {
      const tscVersion = execSync('npx tsc --version', { encoding: 'utf8' }).trim();
      console.log(`📦 TypeScript: ${tscVersion}`);
    } catch (error) {
      console.log('⚠️  TypeScript no encontrado, instalando...');
      execSync('npm install typescript --save-dev', { stdio: 'inherit' });
    }
  }

  private getDefaultConfig(): EnvironmentConfig {
    return {
      network: 'testnet',
      algodToken: '',
      algodServer: 'https://testnet-api.algonode.cloud',
      algodPort: 443,
      indexerToken: '',
      indexerServer: 'https://testnet-idx.algonode.cloud',
      indexerPort: 443,
      walletMnemonic: '',
      managerAddress: '',
      reserveAddress: '',
      freezeAddress: '',
      clawbackAddress: ''
    };
  }

  private printNextSteps(): void {
    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('='.repeat(50));
    console.log('1. 📝 Configura el archivo .env con tus valores');
    console.log('2. 🔑 Genera wallets de prueba para testnet');
    console.log('3. 🧪 Ejecuta las pruebas: npm run test');
    console.log('4. 🚀 Despliega en testnet: npm run deploy:testnet');
    console.log('5. 📊 Monitorea el token: npm run health-check');
    console.log('\n📚 Documentación: README.md');
    console.log('🐛 Reportar bugs: GitHub Issues');
  }
}

// Script ejecutable
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new EnvironmentSetup();
  
  setup.setupEnvironment()
    .then(() => {
      console.log('🎉 Configuración completada!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error en la configuración:', error);
      process.exit(1);
    });
}
