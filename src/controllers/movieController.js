class MovieController {
    constructor({ movieService }) {
        this.movieService = movieService;
    }

    getAll = async (req, res) => {
        const movies = await this.movieService.getAll();
        res.json(movies);
    };

    getOne = async (req, res) => {
        const movie = await this.movieService.getOne(req.params.id);
        res.json(movie);
    };

    create = async (req, res) => {
        const movie = await this.movieService.create(req.body);
        res.status(201).json(movie);
    };

    update = async (req, res) => {
        await this.movieService.update(req.params.id, req.body);
        res.json({ message: "Updated" });
    };

    delete = async (req, res) => {
        await this.movieService.delete(req.params.id);
        res.json({ message: "Deleted" });
    };
}

module.exports = MovieController;
