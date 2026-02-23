const { Screening, Room } = require("../models");

class ScreeningService {
    async getByMovie(movieId) {
        return Screening.findAll({
            where: { movieId },
            include: [
                {
                    model: Room,
                    attributes: ["Id", "Name", "Is3D", "IsDolbyAtmos"],
                },
            ],
            order: [["StartTime", "ASC"]],
        });
    }
}

module.exports = ScreeningService;