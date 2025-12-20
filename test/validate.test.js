const { validatePassword } = require('../index');

describe('validatePassword', () => {
  test('should return isValid=true for strong password', () => {
    const result = validatePassword('StrongP@ss1');
    expect(result.valid).toBe(true);
    expect(result.isValid).toBe(true); // new property
    expect(result.errors).toHaveLength(0);
  });

  test('should return isValid=false for short password', () => {
    const result = validatePassword('Weak1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  test('should return isValid=false for missing uppercase', () => {
    const result = validatePassword('weakp@ss1');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain an uppercase letter');
  });

  test('should return isValid=false for missing lowercase', () => {
    const result = validatePassword('WEAKP@SS1');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain a lowercase letter');
  });

  test('should return isValid=false for missing number', () => {
    const result = validatePassword('WeakPass!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain a number');
  });

  test('should return isValid=false for missing special char', () => {
    const result = validatePassword('WeakPass1');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain a special character');
  });

  test('should handle empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is required');
  });
});
