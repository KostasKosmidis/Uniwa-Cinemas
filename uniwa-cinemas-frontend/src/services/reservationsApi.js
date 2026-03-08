import { apiFetch } from "./api";

export const createReservation = ({ screeningId, seats }) =>
    apiFetch("/reservations", {
        method: "POST",
        body: JSON.stringify({ screeningId, seats }),
    });

export const getMyReservations = () => apiFetch("/reservations/me");

export const deleteReservation = (reservationId) =>
    apiFetch(`/reservations/${reservationId}`, { method: "DELETE" });