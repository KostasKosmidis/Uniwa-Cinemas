const { Movie } = require("../models");

exports.getAll = () => Movie.findAll();
exports.getOne = (id) => Movie.findByPk(id);
exports.create = (data) => Movie.create(data);
exports.update = (id, data) => Movie.update(data, { where: { id } });
exports.delete = (id) => Movie.destroy({ where: { id } });