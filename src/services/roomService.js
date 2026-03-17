const { Room } = require("../models");

class RoomService {
    async getAll() {
        return Room.findAll({
            order: [["Name", "ASC"]],
        });
    }

    async create(data) {
        if (!data.Name) throw new Error("Room name is required");
        if (data.Capacity === undefined || data.Capacity === null || data.Capacity === "") {
            throw new Error("Capacity is required");
        }

        return Room.create({
            Name: data.Name,
            Capacity: Number(data.Capacity),
            Is3D: !!data.Is3D,
            IsDolbyAtmos: !!data.IsDolbyAtmos,
            IsIMAX: !!data.IsIMAX,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        });
    }

    async update(id, data) {
        const room = await Room.findByPk(id);
        if (!room) throw new Error("Room not found");

        room.Name = data.Name;
        room.Capacity = Number(data.Capacity);
        room.Is3D = !!data.Is3D;
        room.IsDolbyAtmos = !!data.IsDolbyAtmos;
        room.IsIMAX = !!data.IsIMAX;
        room.UpdatedAt = new Date();

        await room.save();
        return room;
    }

    async delete(id) {
        const deleted = await Room.destroy({
            where: { Id: id },
        });

        if (!deleted) {
            throw new Error("Room not found");
        }

        return { message: "Room deleted" };
    }
}

module.exports = RoomService;