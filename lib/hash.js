import bcrypt from "bcryptjs";

export const hashPassword = async (password, saltRounds = 10) => {
  if (!password) throw new Error("Password is required");
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};
