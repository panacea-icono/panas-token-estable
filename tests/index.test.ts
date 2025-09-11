// PanasToken Estable - Tests
// Este directorio contendrá los tests unitarios

import { describe, it, expect } from '@jest/globals';
import { formatTokenAmount, validateAddress } from '../src/utils';

describe('Utils', () => {
  it('should format token amount correctly', () => {
    const result = formatTokenAmount(1000000, 6);
    expect(result).toBe('1.000000');
  });

  it('should validate address correctly', () => {
    const validAddress = 'A' + '1'.repeat(57);
    const invalidAddress = 'invalid';
    
    expect(validateAddress(validAddress)).toBe(true);
    expect(validateAddress(invalidAddress)).toBe(false);
  });
});
