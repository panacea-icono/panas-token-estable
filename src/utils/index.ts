// PanasToken Estable - Utilities
// Este directorio contendrá funciones de utilidad

export function formatTokenAmount(amount: number, decimals: number): string {
  return (amount / Math.pow(10, decimals)).toFixed(decimals);
}

export function validateAddress(address: string): boolean {
  // Validación básica de dirección de Algorand
  return address.length === 58 && address.startsWith('A');
}

export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9);
}
