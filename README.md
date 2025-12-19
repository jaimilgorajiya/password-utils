<div align="center">

# 🔐 @jaimilgorajiya/password-utils

[![npm version](https://img.shields.io/npm/v/@jaimilgorajiya/password-utils.svg)](https://www.npmjs.com/package/@jaimilgorajiya/password-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@jaimilgorajiya/password-utils.svg)](https://nodejs.org)

**Lightweight Node.js utilities for secure password hashing, validation, comparison, and rate limiting.**

[Installation](#-installation) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Examples](#-usage-examples)

</div>

---

## ✨ Features

- 🔒 **Secure hashing** using bcryptjs with automatic salting
- ✅ **Password validation** with customizable strength rules
- 🔍 **Safe comparison** of plain and hashed passwords
- ⏱️ **Rate limiter** to throttle repeated actions (login attempts, etc.)
- 📦 **Zero configuration** - works out of the box
- 🚀 **ESM-compatible** - modern JavaScript modules
- 🪶 **Lightweight** - minimal dependencies

---

## 📦 Installation

```bash
npm install @jaimilgorajiya/password-utils
```

Or using yarn:

```bash
yarn add @jaimilgorajiya/password-utils
```

> **Requirements:** Node.js >= 14.0.0

---

## 🚀 Quick Start

```javascript
import {
  hashPassword,
  verifyPassword,
  validatePassword,
  rateLimiter,
} from "@jaimilgorajiya/password-utils";

(async () => {
  // 1. Validate password strength
  const { valid, errors } = validatePassword("Weak123");
  if (!valid) {
    console.log("Weak password:", errors);
  }

  // 2. Hash a password
  const hashed = await hashPassword("Strong@1234");
  console.log("Hashed password:", hashed);

  // 3. Verify password
  const match = await verifyPassword("Strong@1234", hashed);
  console.log("Password match:", match); // true

  // 4. Rate limiting (e.g., per user or IP)
  const { allowed, message } = rateLimiter("user@example.com");
  if (!allowed) {
    console.log(message); // "Too many attempts. Try again later."
  }
})();
```

---

## 📚 API Reference

### `hashPassword(password, saltRounds)`

Securely hashes a password using bcryptjs.

**Parameters:**
- `password` *(string, required)* - Plain text password to hash
- `saltRounds` *(number, optional)* - Cost factor for bcrypt. Default: `10`

**Returns:** `Promise<string>` - The hashed password

**Throws:** Error if password is missing

**Example:**

```javascript
const hashed = await hashPassword("Strong@1234", 12);
console.log(hashed); // $2a$12$...
```

---

### `verifyPassword(password, hashedPassword)`

Compares a plain password against a bcrypt hash.

**Parameters:**
- `password` *(string, required)* - Plain text password
- `hashedPassword` *(string, required)* - Hashed password from database

**Returns:** `Promise<boolean>` - `true` if passwords match, `false` otherwise

**Throws:** Error if either parameter is missing

**Example:**

```javascript
const isValid = await verifyPassword("Strong@1234", hashedFromDb);
if (isValid) {
  console.log("Login successful!");
} else {
  console.log("Invalid credentials");
}
```

---

### `validatePassword(password)`

Validates password strength based on predefined rules.

**Parameters:**
- `password` *(string, required)* - Password to validate

**Returns:** `Object`
- `valid` *(boolean)* - Whether the password meets all requirements
- `errors` *(string[])* - Array of validation error messages

**Validation Rules:**
- ✅ Minimum length: **8 characters**
- ✅ At least **one uppercase** letter (A-Z)
- ✅ At least **one lowercase** letter (a-z)
- ✅ At least **one number** (0-9)
- ✅ At least **one special character** (!@#$%^&*(),.?":{}|<>)

**Example:**

```javascript
const { valid, errors } = validatePassword("weak");

if (!valid) {
  console.log("Password validation failed:");
  errors.forEach(error => console.log(`  - ${error}`));
}

// Output:
// Password validation failed:
//   - Password must be at least 8 characters
//   - Password must contain an uppercase letter
//   - Password must contain a number
//   - Password must contain a special character
```

---

### `rateLimiter(identifier, maxAttempts, windowMs)`

Simple in-memory rate limiter for tracking attempts within a time window.

**Parameters:**
- `identifier` *(string, required)* - Unique key (e.g., user ID, email, IP address)
- `maxAttempts` *(number, optional)* - Maximum attempts allowed. Default: `5`
- `windowMs` *(number, optional)* - Time window in milliseconds. Default: `60000` (1 minute)

**Returns:** `Object`
- `allowed` *(boolean)* - Whether the action is allowed
- `message` *(string, optional)* - Error message when limit is exceeded

**Example:**

```javascript
// In an Express.js route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Check rate limit (5 attempts per minute)
  const { allowed, message } = rateLimiter(`login:${email}`);
  
  if (!allowed) {
    return res.status(429).json({ error: message });
  }
  
  // Proceed with login logic...
});
```

> ⚠️ **Note:** This implementation uses an in-memory store. For production applications with multiple instances, consider using a distributed store like Redis for rate limiting.

---

## 💡 Usage Examples

### Complete Authentication Flow

```javascript
import express from "express";
import {
  hashPassword,
  verifyPassword,
  validatePassword,
  rateLimiter,
} from "@jaimil__gorajiya/password-utils";

const app = express();
app.use(express.json());

// User registration
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Validate password strength
  const { valid, errors } = validatePassword(password);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Save user to database
  // await db.users.create({ email, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Rate limiting
  const { allowed, message } = rateLimiter(`login:${email}`, 5, 60000);
  if (!allowed) {
    return res.status(429).json({ error: message });
  }

  // Get user from database
  // const user = await db.users.findOne({ email });

  // Verify password
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Custom Rate Limiting

```javascript
// Limit API requests per IP
app.use((req, res, next) => {
  const ip = req.ip;
  const { allowed, message } = rateLimiter(`api:${ip}`, 100, 60000); // 100 requests per minute
  
  if (!allowed) {
    return res.status(429).json({ error: message });
  }
  
  next();
});
```

### Password Strength Checker UI

```javascript
import { validatePassword } from "@jaimil__gorajiya/password-utils";

function checkPasswordStrength(password) {
  const { valid, errors } = validatePassword(password);
  
  return {
    strength: valid ? "strong" : "weak",
    score: 5 - errors.length, // 0-5 score
    feedback: errors,
  };
}

// Usage in a form
const result = checkPasswordStrength("MyP@ssw0rd");
console.log(result);
// { strength: "strong", score: 5, feedback: [] }
```

---

## 🧪 Testing Your Implementation

Create a test file to verify the package works correctly:

```javascript
// test.js
import {
  hashPassword,
  verifyPassword,
  validatePassword,
  rateLimiter,
} from "@jaimil__gorajiya/password-utils";

(async () => {
  console.log("Testing password-utils...\n");

  // Test 1: Password Validation
  console.log("1. Password Validation:");
  const weakPassword = validatePassword("weak");
  console.log("  Weak password:", weakPassword);
  
  const strongPassword = validatePassword("Strong@1234");
  console.log("  Strong password:", strongPassword);

  // Test 2: Password Hashing
  console.log("\n2. Password Hashing:");
  const hashed = await hashPassword("Strong@1234");
  console.log("  Hashed:", hashed.substring(0, 20) + "...");

  // Test 3: Password Verification
  console.log("\n3. Password Verification:");
  const isValid = await verifyPassword("Strong@1234", hashed);
  console.log("  Correct password:", isValid);
  
  const isInvalid = await verifyPassword("Wrong@1234", hashed);
  console.log("  Wrong password:", isInvalid);

  // Test 4: Rate Limiting
  console.log("\n4. Rate Limiting:");
  for (let i = 1; i <= 7; i++) {
    const result = rateLimiter("test-user", 5, 60000);
    console.log(`  Attempt ${i}:`, result.allowed ? "Allowed" : result.message);
  }

  console.log("\n✅ All tests completed!");
})();
```

Run with: `node test.js`

---

## 📦 What's Included

```
@jaimil__gorajiya/password-utils/
├── index.js              # Main entry point
├── lib/
│   ├── hash.js          # Password hashing
│   ├── compare.js       # Password comparison
│   ├── validate.js      # Password validation
│   └── rateLimiter.js   # Rate limiting
├── package.json
├── README.md
└── LICENSE
```

---

## � Dependencies

- **bcryptjs** (^2.4.3) - Secure password hashing
- **Node.js** (>= 14.0.0)

---

## 📝 Changelog

### v1.0.0 (2025-12-19)
- Initial release
- Password hashing with bcryptjs
- Password validation
- Password comparison
- In-memory rate limiter

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © [Jaimil Gorajiya](https://github.com/jaimilgorajiya)

See [LICENSE](LICENSE) file for details.

---

## � Links

- **npm Package:** [@jaimil__gorajiya/password-utils](https://www.npmjs.com/package/@jaimil__gorajiya/password-utils)
- **GitHub Repository:** [password-utils](https://github.com/jaimilgorajiya/password-utils)
- **Issues:** [Report a bug](https://github.com/jaimilgorajiya/password-utils/issues)
- **Author:** [Jaimil Gorajiya](https://github.com/jaimilgorajiya)

---

## ⭐ Support

If you find this package helpful:

- ⭐ **Star** the repository on [GitHub](https://github.com/jaimilgorajiya/password-utils)
- 📢 **Share** it with your team and community
- 🐛 **Report** issues or suggest features
- 💖 **Contribute** to make it better

---

<div align="center">

**Made with ❤️ by [Jaimil Gorajiya](https://github.com/jaimilgorajiya)**

</div>

