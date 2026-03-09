const { v4: uuidv4 } = require("uuid");

class MovieService {
    constructor({ Movie }) {
        this.Movie = Movie;
    }

    getAll() {
        return this.Movie.findAll({
            order: [["Title", "ASC"]],
        });
    }

    getOne(id) {
        return this.Movie.findByPk(id);
    }

    create(data) {
        return this.Movie.create({
            Id: uuidv4(),
            Title: data.Title,
            Description: data.Description || "",
            DurationMinutes: Number(data.DurationMinutes) || 120,
            ImageUrl: data.ImageUrl || "",
            Rating: data.Rating || "N/A",
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        });
    }

    update(id, data) {
        return this.Movie.update(
            {
                ...data,
                UpdatedAt: new Date(),
            },
            { where: { Id: id } }
        );
    }

    delete(id) {
        return this.Movie.destroy({ where: { Id: id } });
    }
}

module.exports = MovieService;