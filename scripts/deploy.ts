// PanasToken Estable - Main Deployment Script
// Script principal para desplegar el token

import { PanasToken } from '../src/contracts/index.js';
import { TokenConfig } from '../src/types/index.js';

async function deployToken(network: 'testnet' | 'mainnet' = 'testnet') {
  console.log(`🚀 Desplegando PanasToken Estable en ${network}...`);
  
  const tokenConfig: TokenConfig = {
    name: 'PanasToken Estable',
    symbol: 'PANAS',
    decimals: 6,
    totalSupply: 1000000000,
    description: 'Token estable del ecosistema PANAS',
    url: 'https://github.com/panacea-icono/panas-token-estable',
    manager: process.env[`${network.toUpperCase()}_MANAGER_ADDRESS`] || '',
    reserve: process.env[`${network.toUpperCase()}_RESERVE_ADDRESS`] || '',
    freeze: process.env[`${network.toUpperCase()}_FREEZE_ADDRESS`] || '',
    clawback: process.env[`${network.toUpperCase()}_CLAWBACK_ADDRESS`] || ''
  };

  const token = new PanasToken(tokenConfig);
  console.log('📋 Configuración del token:', token.getConfig());
  
  // Verificar configuración
  if (!tokenConfig.manager || !tokenConfig.reserve) {
    console.error('❌ Error: Direcciones de manager y reserve son requeridas');
    console.log('💡 Configura las variables de entorno:');
    console.log(`   ${network.toUpperCase()}_MANAGER_ADDRESS`);
    console.log(`   ${network.toUpperCase()}_RESERVE_ADDRESS`);
    process.exit(1);
  }

  console.log('✅ Configuración validada');
  console.log('⚠️  Para el despliegue real, usa los scripts específicos:');
  console.log('   npm run deploy:testnet');
  console.log('   npm run deploy:mainnet');
  
  console.log('🎉 Preparación completada!');
}

// Script ejecutable
if (import.meta.url === `file://${process.argv[1]}`) {
  const network = (process.argv[2] as 'testnet' | 'mainnet') || 'testnet';
  
  deployToken(network)
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}
