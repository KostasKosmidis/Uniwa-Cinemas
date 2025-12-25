class MovieService {
    constructor({ Movie }) {
        this.Movie = Movie;
    }

    getAll() {
        return this.Movie.findAll();
    }

    getOne(id) {
        return this.Movie.findByPk(id);
    }

    create(data) {
        return this.Movie.create(data);
    }

    update(id, data) {
        return this.Movie.update(data, { where: { id } });
    }

    delete(id) {
        return this.Movie.destroy({ where: { id } });
    }
}

module.exports = MovieService;
