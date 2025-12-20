const { hashPassword, comparePassword, compare } = require('../index');

describe('hashing and comparison', () => {
  test('should hash a password correctly', async () => {
    const password = 'TestPassword123!';
    const hash = await hashPassword(password);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
  });

  test('should verify correct password', async () => {
    const password = 'TestPassword123!';
    const hash = await hashPassword(password);
    const isMatch = await comparePassword(password, hash);
    expect(isMatch).toBe(true);
  });

  test('should verify with compare alias', async () => {
    const password = 'TestPassword123!';
    const hash = await hashPassword(password);
    const isMatch = await compare(password, hash);
    expect(isMatch).toBe(true);
  });

  test('should reject incorrect password', async () => {
    const password = 'TestPassword123!';
    const hash = await hashPassword(password);
    const isMatch = await comparePassword('WrongPassword', hash);
    expect(isMatch).toBe(false);
  });

  test('should throw error if inputs are missing', async () => {
    await expect(hashPassword('')).rejects.toThrow('Password is required');
    await expect(comparePassword('pass', '')).rejects.toThrow();
  });
});
