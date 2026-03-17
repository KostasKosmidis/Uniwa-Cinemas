const { Screening, Room, Movie } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

class ScreeningService {
    async getAll() {
        return Screening.findAll({
            include: [
                {
                    model: Movie,
                    attributes: ["Id", "Title"],
                },
                {
                    model: Room,
                    attributes: ["Id", "Name", "Capacity", "Is3D", "IsDolbyAtmos", "IsIMAX"],
                },
            ],
            order: [["StartTime", "ASC"]],
        });
    }

    async getByMovie(movieId) {
        return Screening.findAll({
            where: {
                MovieId: movieId,
                StartTime: {
                    [Op.gt]: new Date(),
                },
            },
            include: [
                {
                    model: Room,
                    attributes: ["Id", "Name", "Capacity", "Is3D", "IsDolbyAtmos", "IsIMAX"],
                },
            ],
            order: [["StartTime", "ASC"]],
        });
    }

    async create({ movieId, roomId, startTime, price }) {
        if (!movieId) throw new Error("movieId is required");
        if (!roomId) throw new Error("roomId is required");
        if (!startTime) throw new Error("startTime is required");
        if (price === undefined || price === null || price === "") {
            throw new Error("price is required");
        }

        return Screening.create({
            Id: uuidv4(),
            MovieId: movieId,
            RoomId: Number(roomId),
            StartTime: startTime,
            Price: Number(price),
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        });
    }

    async update(id, { roomId, startTime, price }) {
        const screening = await Screening.findByPk(id);
        if (!screening) throw new Error("Screening not found");

        screening.RoomId = Number(roomId);
        screening.StartTime = startTime;
        screening.Price = Number(price);
        screening.UpdatedAt = new Date();

        await screening.save();
        return screening;
    }

    async delete(id) {
        const deleted = await Screening.destroy({
            where: { Id: id },
        });

        if (!deleted) {
            throw new Error("Screening not found");
        }

        return { message: "Screening deleted" };
    }
}

module.exports = ScreeningService;