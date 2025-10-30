const attempts = {};

export const rateLimiter = (identifier, maxAttempts = 5, windowMs = 60000) => {
  const now = Date.now();
  if (!attempts[identifier]) attempts[identifier] = [];
  attempts[identifier] = attempts[identifier].filter(
    (time) => now - time < windowMs
  );

  if (attempts[identifier].length >= maxAttempts) {
    return { allowed: false, message: "Too many attempts. Try again later." };
  }

  attempts[identifier].push(now);
  return { allowed: true };
};
