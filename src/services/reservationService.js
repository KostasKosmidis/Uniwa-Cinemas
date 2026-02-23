const { Reservation, Screening, Movie, Room } = require("../models");
const { v4: uuidv4 } = require("uuid");

class ReservationService {
    async create({ userId, screeningId, seats }) {
        if (!userId) throw new Error("UserId is required");
        if (!screeningId) throw new Error("ScreeningId is required");

        const Seats = Number(seats);
        if (!Seats || Seats < 1) throw new Error("Seats must be >= 1");

        // ensure screening exists (nice validation)
        const screening = await Screening.findByPk(screeningId);
        if (!screening) throw new Error("Screening not found");

        return Reservation.create({
            Id: uuidv4(),
            UserId: userId,
            ScreeningId: screeningId,
            Seats,
            CreatedAt: new Date(),
        });
    }

    async getMine(userId) {
        if (!userId) throw new Error("UserId is required");

        return Reservation.findAll({
            where: { UserId: userId },
            include: [
                {
                    model: Screening,
                    include: [
                        { model: Movie, attributes: ["Id", "Title"] },
                        { model: Room, attributes: ["Id", "Name", "Is3D", "IsDolbyAtmos"] },
                    ],
                },
            ],
            order: [["CreatedAt", "DESC"]],
        });
    }

    async deleteMine({ userId, reservationId }) {
        if (!userId) throw new Error("UserId is required");
        if (!reservationId) throw new Error("ReservationId is required");

        const r = await Reservation.findByPk(reservationId);
        if (!r) return { deleted: 0 };

        if (String(r.UserId) !== String(userId)) {
            const err = new Error("Forbidden");
            err.status = 403;
            throw err;
        }

        await r.destroy();
        return { deleted: 1 };
    }
}

module.exports = ReservationService;