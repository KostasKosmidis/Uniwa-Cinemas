import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const POSTER_CACHE_KEY = "uwc_posters_v2";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function MoviesPage() {
    const [movies, setMovies] = useState([]);
    const [posterMap, setPosterMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;

    // load poster cache
    useEffect(() => {
        try {
            const raw = localStorage.getItem(POSTER_CACHE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!parsed?.data || !parsed?.ts) return;

            const fresh = Date.now() - parsed.ts < CACHE_TTL_MS;
            if (fresh) setPosterMap(parsed.data);
            else localStorage.removeItem(POSTER_CACHE_KEY);
        } catch {
            // ignore cache errors
        }
    }, []);

    const persistCache = (next) => {
        setPosterMap(next);
        try {
            localStorage.setItem(
                POSTER_CACHE_KEY,
                JSON.stringify({ ts: Date.now(), data: next })
            );
        } catch {
            // ignore quota errors
        }
    };

    // fetch movies
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await fetch("http://localhost:3000/movies");
                if (!res.ok) throw new Error(`API error: ${res.status}`);
                const data = await res.json();
                if (mounted) setMovies(Array.isArray(data) ? data : []);
            } catch (e) {
                if (mounted) setError(e.message || "Failed to load movies");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    // OMDb poster fetch (robust): use search (s=) then fallback to title (t=)
    useEffect(() => {
        if (!OMDB_KEY) return; // if missing, list will show placeholders (details can still work if hardcoded elsewhere)
        if (movies.length === 0) return;

        let cancelled = false;

        const titlesToFetch = movies
            .map((m) => m?.Title)
            .filter(Boolean)
            .filter((t) => {
                const key = t.toLowerCase().trim();
                return !posterMap[key]; // not cached yet
            });

        if (titlesToFetch.length === 0) return;

        const queue = [...new Set(titlesToFetch)].slice(0, 40); // safety cap
        const concurrency = 3;

        const run = async () => {
            const nextCache = { ...posterMap };

            const worker = async () => {
                while (!cancelled && queue.length > 0) {
                    const title = queue.shift();
                    const key = title.toLowerCase().trim();
                    if (nextCache[key]) continue;

                    try {
                        const poster = await fetchPosterFromOMDb(title, OMDB_KEY);
                        if (poster) nextCache[key] = poster;
                    } catch {
                        // ignore per-title failures
                    }
                }
            };

            await Promise.all(Array.from({ length: concurrency }, worker));
            if (!cancelled) persistCache(nextCache);
        };

        run();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movies, OMDB_KEY]);

    return (
        <div className="container">
            <h1 className="pageTitle">🎞 Movies</h1>
            <p className="subtle">Browse titles and view full details + showtimes.</p>

            {loading ? <p className="subtle">Loading…</p> : null}
            {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}

            {!loading && !error && (
                <div className="grid" style={{ marginTop: 14 }}>
                    {movies.map((m) => {
                        const k = (m.Title || "").toLowerCase().trim();
                        const cachedPoster = posterMap[k];

                        // Prefer DB ImageUrl (if real), else OMDb cached, else empty => placeholder
                        const posterUrl = (m.ImageUrl && !m.ImageUrl.includes("example.com"))
                            ? m.ImageUrl
                            : (cachedPoster || "");

                        return (
                            <Link key={m.Id} to={`/movies/${m.Id}`} className="card">
                                <div className="cardMedia">
                                    <PosterThumb title={m.Title} imageUrl={posterUrl} />
                                </div>

                                <div className="cardBody">
                                    <h3 className="cardTitle">{m.Title}</h3>

                                    <div className="metaRow">
                                        <span className="pill">⏱ {m.DurationMinutes} min</span>
                                        <span className="pill">⭐ {m.Rating}</span>
                                        {cachedPoster ? (
                                            <span className="pill" style={{ opacity: 0.85 }}>OMDb</span>
                                        ) : null}
                                    </div>

                                    {m.Description ? (
                                        <p className="subtle" style={{ marginTop: 10, lineHeight: 1.45 }}>
                                            {m.Description.length > 120 ? m.Description.slice(0, 120) + "…" : m.Description}
                                        </p>
                                    ) : (
                                        <p className="subtle" style={{ marginTop: 10 }}>No description.</p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

async function fetchPosterFromOMDb(title, apiKey) {
    // 1) Search first (more tolerant)
    const sRes = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(title)}`
    );
    const sData = await sRes.json();

    const first = sData?.Search?.[0];
    if (first?.Poster && first.Poster !== "N/A") {
        return first.Poster;
    }

    // 2) Fallback to exact title
    const tRes = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`
    );
    const tData = await tRes.json();

    if (tData?.Poster && tData.Poster !== "N/A") {
        return tData.Poster;
    }

    return null;
}

function PosterThumb({ title, imageUrl }) {
    const [ok, setOk] = useState(true);

    useEffect(() => {
        setOk(true);
    }, [imageUrl]);

    if (!imageUrl || !ok) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 8,
                    background:
                        "radial-gradient(700px 280px at 20% 10%, rgba(139,92,246,0.35), transparent 55%), rgba(255,255,255,0.04)",
                }}
            >
                <div style={{ fontSize: 30, opacity: 0.95 }}>🎬</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>No poster</div>
            </div>
        );
    }

    return (
        <img
            className="shimmer"
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={() => setOk(false)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
    );
}