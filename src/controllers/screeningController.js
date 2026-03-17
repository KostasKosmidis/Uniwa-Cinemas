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

    update = async (req, res) => {
        try {
            const screening = await this.screeningService.update(req.params.id, req.body);
            res.json(screening);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message || "Failed to update screening" });
        }
    };

    delete = async (req, res) => {
        try {
            const result = await this.screeningService.delete(req.params.id);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message || "Failed to delete screening" });
        }
    };
}

module.exports = ScreeningController;