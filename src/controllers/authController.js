class AuthController {
    constructor({ authService }) {
        this.authService = authService;
    }

    register = async (req, res) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json(result);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message || "Registration failed" });
        }
    };

    login = async (req, res) => {
        try {
            const result = await this.authService.login(req.body);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: err.message || "Wrong Credentials" });
        }
    };
}

module.exports = AuthController;