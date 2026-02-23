class ReservationController {
    constructor({ reservationService }) {
        this.reservationService = reservationService;
    }

    create = async (req, res) => {
        try {
            const userId = req.user?.userId || req.user?.Id || req.user?.id || req.user?.UserId;
            const { screeningId, seats } = req.body;

            const created = await this.reservationService.create({
                userId,
                screeningId,
                seats,
            });

            res.status(201).json(created);
        } catch (err) {
            console.error(err);
            res.status(err.status || 400).json({ message: err.message || "Reservation failed" });
        }
    };

    mine = async (req, res) => {
        try {
            const userId = req.user?.userId || req.user?.Id || req.user?.id || req.user?.UserId;
            const rows = await this.reservationService.getMine(userId);
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to load reservations" });
        }
    };

    deleteMine = async (req, res) => {
        try {
            const userId = req.user?.userId || req.user?.Id || req.user?.id || req.user?.UserId;
            const { id } = req.params;

            const result = await this.reservationService.deleteMine({
                userId,
                reservationId: id,
            });

            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(err.status || 500).json({ message: err.message || "Delete failed" });
        }
    };
}

module.exports = ReservationController;