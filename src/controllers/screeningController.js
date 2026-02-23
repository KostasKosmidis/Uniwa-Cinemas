class ScreeningController {
    constructor({ screeningService }) {
        this.screeningService = screeningService;
    }

    getByMovie = async (req, res) => {
        try {
            const { movieId } = req.params;
            const screenings = await this.screeningService.getByMovie(movieId);
            res.json(screenings);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to fetch screenings" });
        }
    };
}

module.exports = ScreeningController;