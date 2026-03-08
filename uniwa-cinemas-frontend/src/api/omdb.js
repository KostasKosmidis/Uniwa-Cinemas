// src/api/omdb.js
const KEY = import.meta.env.VITE_OMDB_KEY;

if (!KEY) {
    // Μην σπάει το build, αλλά θα το βλέπεις στο console
    console.warn("Missing VITE_OMDB_KEY in uniwa-cinemas-frontend/.env");
}

const cache = new Map();

function buildUrl(params) {
    const base = "https://www.omdbapi.com/";
    const qs = new URLSearchParams({ apikey: KEY, ...params });
    return `${base}?${qs.toString()}`;
}

export async function omdbByTitle(title, year) {
    const key = `t:${title}:${year || ""}`;
    if (cache.has(key)) return cache.get(key);

    const url = buildUrl({ t: title, ...(year ? { y: year } : {}), plot: "full" });
    const res = await fetch(url);
    const data = await res.json();

    // OMDb όταν αποτύχει στέλνει Response: "False"
    if (data?.Response === "False") {
        cache.set(key, null);
        return null;
    }

    cache.set(key, data);
    return data;
}