const { loginRateLimiter } = require('../index');

describe('loginRateLimiter', () => {
  beforeEach(() => {
    // Reset internal state if possible, or use unique IDs
  });

  test('should allow first attempt', () => {
    const id = 'user1';
    const result = loginRateLimiter(id);
    expect(result.allowed).toBe(true);
  });

  test('should block after max attempts', () => {
    const id = 'user_flood';
    const max = 3;
    loginRateLimiter(id, max); // 1
    loginRateLimiter(id, max); // 2
    const res3 = loginRateLimiter(id, max); // 3 (allowed, but now at limit?)
    // Logic: push(now). if length >= max return false.
    // 1: push. len=1. <3. allowed.
    // 2: push. len=2. <3. allowed.
    // 3: push. len=3. >=3. allowed? No, check is before push?
    
    // Let's check implementation:
    // if (attempts >= max) return false;
    // push(); return true;
    
    // So 1, 2, 3 are allowed? Wait.
    // If logic is: check >= max, then push.
    // 0 attempts. check(0>=3) No. Push. Return true. (Count 1)
    // 1 attempt. check(1>=3) No. Push. Return true. (Count 2)
    // 2 attempts. check(2>=3) No. Push. Return true. (Count 3)
    // 3 attempts. check(3>=3) YES. Return false.
    
    // So 3 calls should be allowed, 4th blocked.
    
    expect(res3.allowed).toBe(true);
    
    const res4 = loginRateLimiter(id, max);
    expect(res4.allowed).toBe(false);
    expect(res4.message).toBeDefined();
  });
  
  test('should reset after window', async () => {
      // Mock Date.now? Or just trust logic.
      // We can rely on logic check: (now - time < windowMs)
      // Since it's unit test, we can trust the logic if code is correct.
      // But let's verify logic with short window.
      
      const id = 'quick_expire';
      const windowMs = 100; // 0.1s
      
      loginRateLimiter(id, 1, windowMs); // 1st attempt, count=1
      const res2 = loginRateLimiter(id, 1, windowMs); // 2nd attempt, count=1>=1? YES. Blocked.
      expect(res2.allowed).toBe(false);
      
      // Wait for window
      await new Promise(r => setTimeout(r, 150));
      
      const resAfter = loginRateLimiter(id, 1, windowMs);
      expect(resAfter.allowed).toBe(true);
  });
});
