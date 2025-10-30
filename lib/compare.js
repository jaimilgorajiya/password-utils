import bcrypt from "bcryptjs";

/**
 * Compare plain password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from DB
 */
export const verifyPassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword)
    throw new Error("Both password and hashedPassword are required");
  return await bcrypt.compare(password, hashedPassword);
};
