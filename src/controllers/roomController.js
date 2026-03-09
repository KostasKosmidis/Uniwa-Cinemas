class RoomController {
    constructor({ roomService }) {
        this.roomService = roomService;
    }

    getAll = async (req, res) => {
        try {
            const rooms = await this.roomService.getAll();
            res.json(rooms);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to fetch rooms" });
        }
    };
}

module.exports = RoomController;