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

    create = async (req, res) => {
        try {
            const room = await this.roomService.create(req.body);
            res.status(201).json(room);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message || "Failed to create room" });
        }
    };

    update = async (req, res) => {
        try {
            const room = await this.roomService.update(req.params.id, req.body);
            res.json(room);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message || "Failed to update room" });
        }
    };

    delete = async (req, res) => {
        try {
            const result = await this.roomService.delete(req.params.id);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message || "Failed to delete room" });
        }
    };
}

module.exports = RoomController;