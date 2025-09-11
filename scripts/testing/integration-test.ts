// PanasToken Estable - Integration Tests
// Script para pruebas de integración del token

import { Algodv2, Indexer } from 'algosdk';
import { PanasToken } from '../../src/contracts/index.js';
import { TokenConfig } from '../../src/types/index.js';

interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  details?: any;
}

export class TokenIntegrationTester {
  private algodClient: Algodv2;
  private indexer: Indexer;
  private assetId: number;
  private testAccount: any;

  constructor(assetId: number, testAccountMnemonic: string) {
    this.assetId = assetId;
    this.testAccount = this.getAccountFromMnemonic(testAccountMnemonic);
    
    // Configuración para testnet
    this.algodClient = new Algodv2('', 'https://testnet-api.algonode.cloud', 443);
    this.indexer = new Indexer('', 'https://testnet-idx.algonode.cloud', 443);
  }

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Iniciando pruebas de integración...');
    
    const tests = [
      this.testTokenCreation.bind(this),
      this.testTokenTransfer.bind(this),
      this.testTokenBalance.bind(this),
      this.testTokenMetadata.bind(this),
      this.testTokenPermissions.bind(this),
      this.testTokenSupply.bind(this)
    ];

    const results: TestResult[] = [];
    
    for (const test of tests) {
      const result = await this.runTest(test);
      results.push(result);
    }

    this.printTestSummary(results);
    return results;
  }

  private async runTest(testFunction: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();
    const testName = testFunction.name;
    
    try {
      console.log(`🔍 Ejecutando: ${testName}`);
      const details = await testFunction();
      const duration = Date.now() - startTime;
      
      console.log(`✅ ${testName} - PASÓ (${duration}ms)`);
      return {
        testName,
        status: 'passed',
        duration,
        details
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.log(`❌ ${testName} - FALLÓ (${duration}ms)`);
      console.log(`   Error: ${error.message}`);
      
      return {
        testName,
        status: 'failed',
        duration,
        error: error.message
      };
    }
  }

  private async testTokenCreation(): Promise<any> {
    // Verificar que el token existe
    const assetInfo = await this.algodClient.getAssetByID(this.assetId).do();
    
    if (!assetInfo) {
      throw new Error('Token no encontrado');
    }
    
    return {
      assetId: this.assetId,
      name: assetInfo.params.name,
      symbol: assetInfo.params.unitName,
      decimals: assetInfo.params.decimals
    };
  }

  private async testTokenTransfer(): Promise<any> {
    // Implementar prueba de transferencia
    // Esto requeriría crear una transacción de transferencia
    throw new Error('Implementar prueba de transferencia');
  }

  private async testTokenBalance(): Promise<any> {
    // Verificar balance del token
    const accountInfo = await this.algodClient.accountInformation(this.testAccount.addr).do();
    const assetHolding = accountInfo.assets?.find((a: any) => a['asset-id'] === this.assetId);
    
    if (!assetHolding) {
      throw new Error('Token no encontrado en la cuenta');
    }
    
    return {
      address: this.testAccount.addr,
      balance: assetHolding.amount,
      frozen: assetHolding['is-frozen']
    };
  }

  private async testTokenMetadata(): Promise<any> {
    // Verificar metadatos del token
    const assetInfo = await this.algodClient.getAssetByID(this.assetId).do();
    
    const requiredFields = ['name', 'unitName', 'decimals', 'total'];
    const missingFields = requiredFields.filter(field => !assetInfo.params[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos faltantes: ${missingFields.join(', ')}`);
    }
    
    return {
      name: assetInfo.params.name,
      symbol: assetInfo.params.unitName,
      decimals: assetInfo.params.decimals,
      total: assetInfo.params.total,
      url: assetInfo.params.url,
      manager: assetInfo.params.manager,
      reserve: assetInfo.params.reserve
    };
  }

  private async testTokenPermissions(): Promise<any> {
    // Verificar permisos del token
    const assetInfo = await this.algodClient.getAssetByID(this.assetId).do();
    
    return {
      manager: assetInfo.params.manager,
      reserve: assetInfo.params.reserve,
      freeze: assetInfo.params.freeze,
      clawback: assetInfo.params.clawback,
      defaultFrozen: assetInfo.params['default-frozen']
    };
  }

  private async testTokenSupply(): Promise<any> {
    // Verificar suministro del token
    const assetInfo = await this.algodClient.getAssetByID(this.assetId).do();
    
    if (assetInfo.params.total <= 0) {
      throw new Error('Suministro total debe ser mayor a 0');
    }
    
    return {
      total: assetInfo.params.total,
      decimals: assetInfo.params.decimals,
      circulating: assetInfo.params.total - (assetInfo.params.reserve || 0)
    };
  }

  private getAccountFromMnemonic(mnemonic: string) {
    // Implementar creación de cuenta desde mnemónico
    throw new Error('Implementar creación de cuenta desde mnemónico');
  }

  private printTestSummary(results: TestResult[]): void {
    console.log('\n📊 RESUMEN DE PRUEBAS');
    console.log('='.repeat(50));
    
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    
    console.log(`✅ Pasaron: ${passed}`);
    console.log(`❌ Fallaron: ${failed}`);
    console.log(`⏭️  Omitidas: ${skipped}`);
    console.log(`📈 Total: ${results.length}`);
    
    if (failed > 0) {
      console.log('\n❌ PRUEBAS FALLIDAS:');
      results
        .filter(r => r.status === 'failed')
        .forEach(r => console.log(`   - ${r.testName}: ${r.error}`));
    }
    
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    console.log(`\n⏱️  Duración total: ${totalDuration}ms`);
  }
}

// Script ejecutable
if (import.meta.url === `file://${process.argv[1]}`) {
  const assetId = parseInt(process.argv[2]) || 0;
  const testAccountMnemonic = process.env.TEST_ACCOUNT_MNEMONIC;
  
  if (assetId === 0) {
    console.error('❌ Asset ID requerido');
    console.log('Uso: npm run integration-test <asset-id>');
    process.exit(1);
  }
  
  if (!testAccountMnemonic) {
    console.error('❌ TEST_ACCOUNT_MNEMONIC no está configurado');
    process.exit(1);
  }

  const tester = new TokenIntegrationTester(assetId, testAccountMnemonic);
  
  tester.runAllTests()
    .then(results => {
      const failed = results.filter(r => r.status === 'failed').length;
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Error en las pruebas:', error);
      process.exit(1);
    });
}
