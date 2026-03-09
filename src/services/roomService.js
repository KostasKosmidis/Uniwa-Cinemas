const { Room } = require("../models");

class RoomService {
    async getAll() {
        return Room.findAll({
            order: [["Name", "ASC"]],
        });
    }
}

module.exports = RoomService;