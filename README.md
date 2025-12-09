<div align="center">

# 🔐 @jaimil__gorajiya/password-utils

Lightweight Node.js utilities for **secure password hashing**, **validation**, **comparison**, and a simple **in-memory rate limiter**.

</div>

---

## ✨ Features

- **Secure hashing** using bcrypt with automatic salting.
- **Password validation** with strong default rules (length, upper/lowercase, number, special char).
- **Safe comparison** of plain and hashed passwords.
- **Simple rate limiter** to throttle repeated actions (e.g. login attempts).
- ESM-compatible, minimal API, easy to plug into any Node.js backend.

---

## 📦 Installation

```bash
npm install @jaimil__gorajiya/password-utils
# or
yarn add @jaimil__gorajiya/password-utils
```

> Requires **Node.js 14+**.

---

## 🚀 Quick Start

```js
import {
  hashPassword,
  verifyPassword,
  validatePassword,
  rateLimiter,
} from "@jaimil__gorajiya/password-utils";

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
  console.log("Password match:", match); // true / false

  // 4. Basic rate limiting (e.g. per user or IP)
  const { allowed, message } = rateLimiter("user@example.com");
  if (!allowed) {
    console.log(message);
  }
})();
```

---

## 📚 API Reference

### `hashPassword(password, saltRounds = 10): Promise<string>`

Securely hashes a password using bcrypt.

- **password** `string` – Plain text password (required).
- **saltRounds** `number` – Cost factor for bcrypt. Default: `10`.

Throws an error if `password` is missing.

**Example:**

```js
const hashed = await hashPassword("Strong@1234", 12);
```

---

### `verifyPassword(password, hashedPassword): Promise<boolean>`

Compares a plain password against a bcrypt hash.

- **password** `string` – Plain text password.
- **hashedPassword** `string` – Hashed password from your database.

Returns `true` if they match, otherwise `false`.
Throws an error if either argument is missing.

**Example:**

```js
const isValid = await verifyPassword("Strong@1234", hashedFromDb);
```

---

### `validatePassword(password): { valid: boolean; errors: string[] }`

Validates password strength using the following default rules:

- Minimum length: **8** characters
- At least **one uppercase** letter
- At least **one lowercase** letter
- At least **one number**
- At least **one special character** `!@#$%^&*(),.?":{}|<>`

**Example:**

```js
const { valid, errors } = validatePassword("Strong@1234");

if (!valid) {
  console.log("Password is not strong enough:", errors);
}
```

---

### `rateLimiter(identifier, maxAttempts = 5, windowMs = 60000)`

Simple in-memory rate limiter for tracking attempts during a time window.

- **identifier** `string` – Unique key (e.g. user id, email, IP).
- **maxAttempts** `number` – Max attempts allowed in window. Default: `5`.
- **windowMs** `number` – Time window in milliseconds. Default: `60000` (1 minute).

Returns:

```ts
{ allowed: boolean; message?: string }
```

When the limit is exceeded:

```js
const { allowed, message } = rateLimiter("login:user@example.com");

if (!allowed) {
  return res.status(429).json({ message });
}
```

> ⚠️ This implementation uses an in-memory store. For production, consider a
> distributed store (Redis, etc.) if you need multi-instance rate limiting.

---

## 📦 Dependencies

- `bcryptjs`
- Node.js `>= 14`

---

## 🧱 Tech Stack

- Node.js
- JavaScript (ES modules)
- bcryptjs

---

## 📜 License

MIT © [Jaimil Gorajiya](https://github.com/jaimilgorajiya)

---

## ⭐ Support

If you find this package helpful:

- **Star** the repo on GitHub: <https://github.com/jaimilgorajiya/password-utils>
- **Share** it in your projects and with your team.

Made by [Jaimil Gorajiya](https://github.com/jaimilgorajiya).

