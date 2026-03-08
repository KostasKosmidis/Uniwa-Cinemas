import { apiFetch } from "./api";

export const getMovies = () => apiFetch("/movies");
export const getMovie = (id) => apiFetch(`/movies/${id}`);