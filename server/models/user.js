const { createError } = require("../middlewares/errorHandler");
const { hashPassword, verifyPassword } = require("../helpers/bcryptjs");
const { db } = require("../config/db");
const { ObjectId } = require("mongodb");

const usersCollection = db.collection("users");
const register = async (userData) => {
  const { username, email, password, role } = userData;

  const existingUser = await usersCollection.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw createError("Email is already in use.", 400);
    }
    if (existingUser.username === username) {
      throw createError("Username is already in use.", 400);
    }
  }

  const hashedPassword = await hashPassword(password, 10);

  const newUser = {
    username,
    email,
    password: hashedPassword,
    role,
  };

  const result = await usersCollection.insertOne(newUser);

  if (!result.acknowledged) {
    throw createError("Failed to register user.", 500);
  }

  delete newUser.password;
  return newUser;
};

const login = async (credentials) => {
  const { emailOrUsername, password } = credentials;

  const user = await usersCollection.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    throw createError("Invalid email or username.", 401);
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw createError("Invalid email or password.", 401);
  }

  delete user.password;
  return user;
};

const getUserById = async (id) => {
  return await usersCollection.findOne({ _id: new ObjectId(String(id)) });
};

module.exports = {
  register,
  login,
  getUserById,
};
