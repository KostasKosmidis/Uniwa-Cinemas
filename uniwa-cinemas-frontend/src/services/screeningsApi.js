import { apiFetch } from "./api";

export const getScreeningsByMovie = (movieId) =>
    apiFetch(`/screenings/movie/${movieId}`);