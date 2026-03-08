import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../Services/moviesApi";
import { omdbByTitle } from "../api/omdb";

function Poster({ src, alt }) {
    const [ok, setOk] = useState(true);

    if (!src || src === "N/A" || !ok) {
        return (
            <div className="moviesPosterFallback">
                <div className="moviesPosterFallbackInner">
                    <span className="emoji">🎬</span>
                    <span>No poster</span>
                </div>
            </div>
        );
    }

    return (
        <img
            className="moviesPosterImg"
            src={src}
            alt={alt}
            onError={() => setOk(false)}
        />
    );
}

export default function MoviesPage() {
    const [movies, setMovies] = useState([]);
    const [omdbMap, setOmdbMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                const list = await getMovies();
                if (!alive) return;

                setMovies(list || []);

                const pairs = await Promise.all(
                    (list || []).map(async (m) => {
                        const data = await omdbByTitle(m.Title, m.Year);
                        return [m.Id, data];
                    })
                );

                if (!alive) return;

                const next = {};
                for (const [id, data] of pairs) next[id] = data;
                setOmdbMap(next);
            } catch (e) {
                console.error(e);
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);

    const items = useMemo(() => {
        return movies.map((m) => {
            const omdb = omdbMap[m.Id];
            const poster = omdb?.Poster;

            return (
                <Link key={m.Id} to={`/movies/${m.Id}`} className="moviesCard">
                    <div className="moviesPoster">
                        <Poster src={poster} alt={m.Title} />
                        <div className="moviesPosterOverlay">
                            <span className="moviesDetailsPill">Details</span>
                        </div>
                    </div>

                    <div className="moviesCardBody">
                        <h3 className="moviesCardTitle">{m.Title}</h3>

                        <div className="moviesChips">
                            <span className="moviesChip">⏱ {m.DurationMinutes} min</span>
                            <span className="moviesChip">⭐ {m.Rating}</span>
                            {omdb?.imdbRating && omdb.imdbRating !== "N/A" ? (
                                <span className="moviesChip">IMDb {omdb.imdbRating}</span>
                            ) : null}
                        </div>

                        <p className="moviesCardDesc">{m.Description}</p>
                    </div>
                </Link>
            );
        });
    }, [movies, omdbMap]);

    return (
        <div className="moviesPage">
            <div className="moviesHeader">
                <h1 className="moviesTitle">🎞️ Movies</h1>
                <p className="moviesSubtitle">
                    Browse titles and book seats for available showtimes.
                </p>
            </div>

            {loading ? <div className="moviesMuted">Loading…</div> : null}

            <div className="moviesGrid">{items}</div>
        </div>
    );
}