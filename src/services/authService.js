const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.register = async ({ username, password }) => {
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashed,
  });

  return { message: "User created", user };
};

exports.login = async ({ username, password }) => {
  const user = await User.findOne({ where: { username } });
  if (!user) return { error: "User not found" };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { error: "Invalid credentials" };

  const token = jwt.sign(
    { id: user.id, role: user.role },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  return { message: "Logged in", token };
};