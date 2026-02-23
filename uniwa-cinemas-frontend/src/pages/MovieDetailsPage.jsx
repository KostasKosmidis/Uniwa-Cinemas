import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function MovieDetailsPage() {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [omdb, setOmdb] = useState(null);
    const [screenings, setScreenings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;

    useEffect(() => {
        let mounted = true;

        (async () => {
            setLoading(true);
            setErr("");

            try {
                const mRes = await fetch(`http://localhost:3000/movies/${id}`);
                const m = await mRes.json();
                if (!mounted) return;
                setMovie(m);

                // screenings
                const sRes = await fetch(`http://localhost:3000/screenings/movie/${id}`);
                const s = await sRes.json();
                if (mounted) setScreenings(Array.isArray(s) ? s : []);

                // OMDb
                if (m?.Title) {
                    const oRes = await fetch(
                        `https://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${encodeURIComponent(m.Title)}&plot=full`
                    );
                    const o = await oRes.json();
                    if (mounted) setOmdb(o);
                }
            } catch (e) {
                if (mounted) setErr(e.message || "Failed to load details");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [id]);

    if (loading) return <div className="container"><p>Loading…</p></div>;
    if (err) return <div className="container"><p style={{ color: "var(--danger)" }}>{err}</p></div>;
    if (!movie) return <div className="container"><p>Movie not found.</p></div>;

    const poster =
        (omdb?.Poster && omdb.Poster !== "N/A" && omdb.Poster) ||
        (movie.ImageUrl ? movie.ImageUrl : null);

    return (
        <div className="container">
            <div style={{ marginTop: 18 }}>
                <Link className="link" to="/">← Back to Movies</Link>
            </div>

            <div className="detailsWrap">
                <div className="poster">
                    {poster ? (
                        <img src={poster} alt={movie.Title} />
                    ) : (
                        <div style={{ padding: 18 }} className="subtle">No poster</div>
                    )}
                </div>

                <div className="panel">
                    <h1 style={{ marginTop: 0, marginBottom: 8 }}>{movie.Title}</h1>

                    <div className="kicker">
                        <span className="pill">⏱ {movie.DurationMinutes} min</span>
                        <span className="pill">⭐ {movie.Rating}</span>
                        {omdb?.Year && omdb.Year !== "N/A" && <span className="pill">📅 {omdb.Year}</span>}
                        {omdb?.Genre && omdb.Genre !== "N/A" && <span className="pill">🎭 {omdb.Genre}</span>}
                        {omdb?.imdbRating && omdb.imdbRating !== "N/A" && <span className="pill">IMDb {omdb.imdbRating}</span>}
                    </div>

                    <div className="divider" />

                    <div>
                        <div className="sectionTitle">Overview</div>
                        <p className="subtle" style={{ lineHeight: 1.6, marginTop: 6 }}>
                            {movie.Description || "No description available."}
                        </p>
                    </div>

                    <div className="sectionTitle">OMDb Plot (Full)</div>
                    <p className="subtle" style={{ lineHeight: 1.6, marginTop: 6 }}>
                        {omdb?.Plot && omdb.Plot !== "N/A" ? omdb.Plot : "No OMDb plot available."}
                    </p>

                    <div className="divider" />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <div className="sectionTitle">Director</div>
                            <div className="subtle">{omdb?.Director && omdb.Director !== "N/A" ? omdb.Director : "-"}</div>
                        </div>
                        <div>
                            <div className="sectionTitle">Actors</div>
                            <div className="subtle">{omdb?.Actors && omdb.Actors !== "N/A" ? omdb.Actors : "-"}</div>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="sectionTitle">🎟 Available Showtimes</div>

                    {screenings.length === 0 ? (
                        <p className="subtle">No showtimes yet.</p>
                    ) : (
                        <div className="showtimes">
                            {screenings.map((s) => {
                                const dt = new Date(s.StartTime);
                                const time = dt.toLocaleString();

                                return (
                                    <div key={s.Id} className="showtimeRow">
                                        <div>
                                            <strong>{time}</strong>
                                            <div className="muted2">
                                                Room: {s.Room?.Name || s.RoomId} • {s.Room?.IsDolbyAtmos ? "Dolby Atmos" : "Standard"} • {s.Room?.Is3D ? "3D" : "2D"}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span className="pill">💳 {s.Price}€</span>
                                            <button className="btn btnPrimary" disabled title="Next step: reservations">
                                                Reserve
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}