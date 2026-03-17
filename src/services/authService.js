const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AuthService {
    constructor({ User }) {
        this.User = User;
    }

    async register({ username, password }) {
        if (!username || !password) {
            throw new Error("Username and password are required");
        }

        const existing = await this.User.findOne({
            where: { Username: username },
        });

        if (existing) {
            throw new Error("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.User.create({
            Username: username,
            PasswordHash: hashedPassword,
            Role: "user",
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        });

        return {
            message: "User created successfully",
            user: {
                Id: user.Id,
                Username: user.Username,
                Role: user.Role,
            },
        };
    }

    async login({ username, password }) {
        if (!username || !password) {
            throw new Error("Wrong Credentials");
        }

        const user = await this.User.findOne({
            where: { Username: username },
        });

        if (!user) {
            throw new Error("Wrong Credentials");
        }

        const ok = await bcrypt.compare(password, user.PasswordHash);
        if (!ok) {
            throw new Error("Wrong Credentials");
        }

        const token = jwt.sign(
            {
                userId: user.Id,
                username: user.Username,
                role: user.Role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return {
            token,
            user: {
                Id: user.Id,
                Username: user.Username,
                Role: user.Role,
            },
        };
    }
}

module.exports = AuthService;