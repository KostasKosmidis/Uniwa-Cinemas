const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

class AuthService {
    async register(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            Username: username,
            PasswordHash: hashedPassword,
            Role: "user", // default role
        });

        return user;
    }

    async login(username, password) {
        const user = await User.findOne({
            where: { Username: username },
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(password, user.PasswordHash);
        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { userId: user.Id, role: user.Role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return token;
    }
}

module.exports = AuthService;
