# 🔐 Password Utils

A lightweight and secure Node.js utility for **password hashing**, **validation**, and **comparison** — powered by **bcrypt**.  
Simplify your authentication logic with built-in best practices for security and performance.

---

## ✨ Features

- 🔒 **Secure Hashing:** Hash passwords using bcrypt with automatic salting.  
- 🧠 **Password Validation:** Enforces strong password rules (uppercase, lowercase, number, symbol, and min length).  
- ⚙️ **Password Comparison:** Compare plain and hashed passwords safely.  
- 🚦 **Rate Limiter (Optional):** Prevent brute-force attacks with a simple in-memory limiter.  
- 📦 **Lightweight & Fast:** Minimal dependencies, optimized for Node.js backends.  

---

## 📥 Installation

Install the package using npm or yarn:

```bash
npm install password-utils

or


yarn add password-utils
---


## 🚀 Usage

Here’s a simple example of how to use Password Utils in your Node.js project:

import { hashPassword, verifyPassword, validatePassword, rateLimiter } from "password-utils";

(async () => {
  // ✅ Validate Password
  const { valid, errors } = validatePassword("Weak123");
  if (!valid) console.log("Weak password:", errors);

  // 🔐 Hash Password
  const hashed = await hashPassword("Strong@1234");
  console.log("Hashed password:", hashed);

  // 🔍 Compare Passwords
  const match = await verifyPassword("Strong@1234", hashed);
  console.log("Password match:", match);

  // 🚦 Rate Limiter Example
  const result = rateLimiter("user@example.com");
  console.log(result);
})();

---


##⚙️ API Reference

|----------------------------------|-----------------------------------------|-------------------------------------------|
|         Function                 |            Description                  |            Returns                        |
|----------------------------------|-----------------------------------------|-------------------------------------------|
| `validatePassword(password)`     | Validates password strength.            | `{ valid: boolean, errors: string[] }`    |
| `hashPassword(password)`         | Hashes password securely using bcrypt.  | `Promise<string>`                         |
| `verifyPassword(plain, hashed)`  | Compares plain and hashed passwords.    | `Promise<boolean>`                        |
| `rateLimiter(identifier)`        | Tracks attempts to prevent brute-force. | `{ attempts: number, blocked: boolean }`  |
|----------------------------------|-----------------------------------------|-------------------------------------------|

---

## 📦 Dependencies

bcrypt: ^6.0.0
Node.js: >=14

---


## 🏗️ Tech Stack

Node.js
bcrypt
JavaScript (ESM Modules)

---

## 📜 License

MIT © [Jaimil Gorajiya](https://github.com/jaimilgorajiya)

---

## 💡 Support

If you find this package helpful, please give it a ⭐ on [GitHub](https://github.com/jaimilgorajiya/password-utils)!  
Made with ❤️ by [Jaimil Gorajiya](https://github.com/jaimilgorajiya)
