class AuthController {
    constructor({ authService }) {
        this.authService = authService;
    }

    register = async (req, res) => {
        const { username, password } = req.body;

        const user = await this.authService.register(username, password);
        res.status(201).json({
            message: "User created",
            user: {
                Id: user.Id,
                Username: user.Username,
                Role: user.Role,
            },
        });
    };

    login = async (req, res) => {
        const { username, password } = req.body;

        const token = await this.authService.login(username, password);
        res.json({ token });
    };
}

module.exports = AuthController;
