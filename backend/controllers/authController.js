const authService = require("../services/authService");

const signup = async (req, res) => {
  const { fullName, email, password } = req.body || {};

  try {
    const payload = await authService.signup({ fullName, email, password });
    res.status(201).json(payload);
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Failed to sign up user", error);
    res.status(500).json({ message: "Failed to sign up user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    const payload = await authService.login({ email, password });
    res.status(200).json(payload);
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Failed to login user", error);
    res.status(500).json({ message: "Failed to login user" });
  }
};

module.exports = {
  signup,
  login,
};
