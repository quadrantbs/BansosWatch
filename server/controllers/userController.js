const { register, login, getUserById } = require("../models/user");
const {
  validateUserRegister,
  validateUserLogin,
} = require("../helpers/validation");
const { generateToken } = require("../helpers/jwt");
const { createNotFoundError } = require("../middlewares/errorHandler");

const registerUser = async (req, res, next) => {
  try {
    const { error } = validateUserRegister(req.body);
    if (error) {
      return next(error);
    }

    const data = req.body;
    if (!data.role) data.role = "user";
    data.createdAt = new Date();

    const newUser = await register(data);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { error } = validateUserLogin(req.body);
    if (error) {
      return next(error);
    }

    const user = await login(req.body);

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return next(createNotFoundError("User not found."));
    }

    const user = await getUserById(userId);

    if (!user) {
      return next(createNotFoundError("User not found."));
    }

    delete user.password;

    return res.status(200).json({
      success: true,
      message: "User successfully retrieved.",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getOneUser };
