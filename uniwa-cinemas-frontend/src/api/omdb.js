import axios from "axios";

const OMDB_BASE = "https://www.omdbapi.com/";

export async function fetchOmdbByTitle(title) {
    const apiKey = import.meta.env.VITE_OMDB_KEY;

    if (!apiKey) {
        throw new Error("Missing VITE_OMDB_KEY in frontend .env");
    }

    const res = await axios.get(OMDB_BASE, {
        params: {
            apikey: apiKey,
            t: title,       // search by title
            plot: "full",   // full plot
        },
    });

    // OMDb returns { Response: "False", Error: "Movie not found!" } on failure
    if (res.data?.Response === "False") {
        throw new Error(res.data?.Error || "OMDb: Movie not found");
    }

    return res.data;
}