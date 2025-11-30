const authService = require("../services/authService");

exports.register = async (req, res) => {
  const result = await authService.register(req.body);
  res.json(result);
};

exports.login = async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
};