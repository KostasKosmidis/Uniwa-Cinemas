class ScreeningController {
    constructor({ screeningService }) {
        this.screeningService = screeningService;
    }

    getAll = async (req, res) => {
        try {
            const screenings = await this.screeningService.getAll();
            res.json(screenings);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to fetch screenings" });
        }
    };

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

    create = async (req, res) => {
        try {
            const { movieId, roomId, startTime, price } = req.body;

            const screening = await this.screeningService.create({
                movieId,
                roomId,
                startTime,
                price,
            });

            res.status(201).json(screening);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message || "Failed to create screening" });
        }
    };
}

module.exports = ScreeningController;