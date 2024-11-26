const { register, login } = require("../models/user");
const {
  validateUserRegister,
  validateUserLogin,
} = require("../helpers/validation");
const { generateToken } = require("../helpers/jwt");

const registerUser = async (req, res, next) => {
  try {
    const { error } = validateUserRegister(req.body);
    if (error) {
      return next(error);
    }

    const data = req.body;
    if (!data.role) data.role = "user";

    const newUser = await register(req.body);

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

module.exports = { registerUser, loginUser };
