import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;

export default function AdminPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const [selectedOmdb, setSelectedOmdb] = useState(null);
    const [savedMovie, setSavedMovie] = useState(null);

    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [price, setPrice] = useState("");

    const [screenings, setScreenings] = useState([]);
    const [screeningsLoading, setScreeningsLoading] = useState(false);

    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [savingMovie, setSavingMovie] = useState(false);
    const [creatingScreening, setCreatingScreening] = useState(false);

    useEffect(() => {
        loadRooms();
        loadMoviesAndScreenings();
    }, []);

    async function loadRooms() {
        try {
            const res = await api.get("/rooms");
            setRooms(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error(e);
            setErr("Failed to load rooms.");
        }
    }

    async function loadMoviesAndScreenings() {
        try {
            setScreeningsLoading(true);

            const [moviesRes, screeningsRes, roomsRes] = await Promise.all([
                api.get("/movies"),
                api.get("/screenings"),
                api.get("/rooms"),
            ]);

            const movies = Array.isArray(moviesRes.data) ? moviesRes.data : [];
            const scr = Array.isArray(screeningsRes.data) ? screeningsRes.data : [];
            const rms = Array.isArray(roomsRes.data) ? roomsRes.data : [];

            const moviesMap = Object.fromEntries(movies.map((m) => [m.Id, m]));
            const roomsMap = Object.fromEntries(rms.map((r) => [String(r.Id), r]));

            const enriched = scr.map((s) => ({
                ...s,
                Movie: moviesMap[s.MovieId] || null,
                Room: roomsMap[String(s.RoomId)] || null,
            }));

            setScreenings(enriched);
        } catch (e) {
            console.error(e);
        } finally {
            setScreeningsLoading(false);
        }
    }

    async function searchMovies(e) {
        e.preventDefault();
        setErr("");
        setMsg("");
        setResults([]);
        setSelectedOmdb(null);
        setSavedMovie(null);

        if (!query.trim()) return;

        try {
            setSearchLoading(true);

            const res = await fetch(
                `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(query)}`
            );
            const data = await res.json();

            if (data.Response === "True") {
                setResults(data.Search || []);
            } else {
                setErr("No OMDb results found.");
            }
        } catch (e2) {
            console.error(e2);
            setErr("Failed to search OMDb.");
        } finally {
            setSearchLoading(false);
        }
    }

    async function selectMovie(imdbID) {
        try {
            setErr("");
            setMsg("");
            setSavedMovie(null);

            const res = await fetch(
                `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${imdbID}&plot=full`
            );
            const data = await res.json();

            if (data.Response !== "True") {
                setErr("Failed to load selected movie details.");
                return;
            }

            setSelectedOmdb(data);
        } catch (e) {
            console.error(e);
            setErr("Failed to load selected movie details.");
        }
    }

    async function saveMovieToDb() {
        if (!selectedOmdb) return;

        try {
            setSavingMovie(true);
            setErr("");
            setMsg("");

            const allMoviesRes = await api.get("/movies");
            const allMovies = Array.isArray(allMoviesRes.data) ? allMoviesRes.data : [];

            const existing = allMovies.find(
                (m) => m.Title?.toLowerCase() === selectedOmdb.Title?.toLowerCase()
            );

            if (existing) {
                setSavedMovie(existing);
                setMsg(`Movie already exists in DB: ${existing.Title}`);
                return;
            }

            const runtimeNumber = parseInt(selectedOmdb.Runtime, 10);

            const createdRes = await api.post("/movies", {
                Title: selectedOmdb.Title,
                Description: selectedOmdb.Plot !== "N/A" ? selectedOmdb.Plot : "",
                DurationMinutes: Number.isFinite(runtimeNumber) ? runtimeNumber : 120,
                ImageUrl: selectedOmdb.Poster !== "N/A" ? selectedOmdb.Poster : "",
                Rating: selectedOmdb.Rated !== "N/A" ? selectedOmdb.Rated : "N/A",
            });

            const createdMovie = createdRes.data;
            setSavedMovie(createdMovie);
            setMsg(`Movie saved successfully ✅ (${createdMovie.Title})`);
        } catch (e) {
            console.error(e);
            setErr(e?.response?.data?.message || "Failed to save movie.");
        } finally {
            setSavingMovie(false);
        }
    }

    async function createScreening(e) {
        e.preventDefault();

        if (!savedMovie?.Id) {
            setErr("Please select and save a movie first.");
            return;
        }

        if (!roomId || !startTime || !price) {
            setErr("Please fill room, date/time and ticket price.");
            return;
        }

        try {
            setCreatingScreening(true);
            setErr("");
            setMsg("");

            await api.post("/screenings", {
                movieId: savedMovie.Id,
                roomId: Number(roomId),
                startTime,
                price: Number(price),
            });

            setMsg("Screening created successfully ✅");
            setRoomId("");
            setStartTime("");
            setPrice("");
            await loadMoviesAndScreenings();
        } catch (e) {
            console.error(e);
            setErr(e?.response?.data?.message || "Failed to create screening.");
        } finally {
            setCreatingScreening(false);
        }
    }

    function formatDateTime(value) {
        try {
            return new Date(value).toLocaleString();
        } catch {
            return value;
        }
    }

    const selectedRoom = useMemo(
        () => rooms.find((r) => String(r.Id) === String(roomId)),
        [rooms, roomId]
    );

    const stats = useMemo(
        () => [
            { label: "Search Results", value: results.length },
            { label: "Available Rooms", value: rooms.length },
            {
                label: "Selected Movie",
                value: savedMovie ? "Saved" : selectedOmdb ? "Chosen" : "-",
            },
        ],
        [results.length, rooms.length, savedMovie, selectedOmdb]
    );

    return (
        <div className="page adminPage">
            <div className="details-card adminShell">
                <h1 className="h1">Admin Panel</h1>
                <p className="muted">
                    Search a movie from OMDb, save it to the database, then create a screening.
                </p>

                {msg ? <div className="alert success">{msg}</div> : null}
                {err ? <div className="alert">{err}</div> : null}

                <div className="reservationMeta adminStats">
                    {stats.map((item) => (
                        <div key={item.label} className="reservationMetaItem">
                            <span className="muted">{item.label}</span>
                            <strong>{item.value}</strong>
                        </div>
                    ))}
                </div>

                <div className="section">
                    <h3>1. Search movie</h3>

                    <form className="form" onSubmit={searchMovies}>
                        <label className="label">
                            Movie title
                            <input
                                className="input"
                                style={{ width: "100%" }}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search e.g. Inception"
                            />
                        </label>

                        <button className="btn btnPrimary" type="submit" disabled={searchLoading}>
                            {searchLoading ? "Searching..." : "Search OMDb"}
                        </button>
                    </form>

                    {results.length > 0 ? (
                        <div className="screenings adminResultsList">
                            {results.map((r) => (
                                <div key={r.imdbID} className="screening-item">
                                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                        {r.Poster && r.Poster !== "N/A" ? (
                                            <img
                                                src={r.Poster}
                                                alt={r.Title}
                                                style={{
                                                    width: 56,
                                                    height: 80,
                                                    objectFit: "cover",
                                                    borderRadius: 10,
                                                    border: "1px solid rgba(255,255,255,0.12)",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: 56,
                                                    height: 80,
                                                    borderRadius: 10,
                                                    border: "1px solid rgba(255,255,255,0.12)",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    background: "rgba(255,255,255,0.04)",
                                                }}
                                            >
                                                🎬
                                            </div>
                                        )}

                                        <div>
                                            <div className="row-title">{r.Title}</div>
                                            <div className="muted small">
                                                {r.Year} • {r.Type}
                                            </div>
                                        </div>
                                    </div>

                                    <button className="btn" type="button" onClick={() => selectMovie(r.imdbID)}>
                                        Select
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                {selectedOmdb ? (
                    <div className="section">
                        <h3>2. Selected movie</h3>

                        <div className="card reservationCard adminSelectedMovieCard">
                            <div className="reservationTop">
                                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                                    {selectedOmdb.Poster && selectedOmdb.Poster !== "N/A" ? (
                                        <img
                                            src={selectedOmdb.Poster}
                                            alt={selectedOmdb.Title}
                                            style={{
                                                width: 120,
                                                height: 170,
                                                objectFit: "cover",
                                                borderRadius: 12,
                                                border: "1px solid rgba(255,255,255,0.12)",
                                            }}
                                        />
                                    ) : null}

                                    <div>
                                        <div className="row-title" style={{ fontSize: 22 }}>
                                            {selectedOmdb.Title}
                                        </div>
                                        <div className="muted">
                                            {selectedOmdb.Year} • {selectedOmdb.Genre}
                                        </div>
                                        <div className="muted small" style={{ marginTop: 6 }}>
                                            {selectedOmdb.Runtime} • {selectedOmdb.Rated} • IMDb {selectedOmdb.imdbRating}
                                        </div>
                                        <div className="muted" style={{ marginTop: 10, maxWidth: 620 }}>
                                            {selectedOmdb.Plot}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        className="btn btnPrimary"
                                        type="button"
                                        onClick={saveMovieToDb}
                                        disabled={savingMovie}
                                    >
                                        {savingMovie ? "Saving..." : "Save Movie"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {savedMovie ? (
                    <div className="section">
                        <h3>3. Create screening</h3>

                        <form className="form" onSubmit={createScreening}>
                            <label className="label">
                                Saved movie
                                <input
                                    className="input"
                                    style={{ width: "100%" }}
                                    value={`${savedMovie.Title} (${savedMovie.Id})`}
                                    readOnly
                                />
                            </label>

                            <label className="label">
                                Room
                                <select
                                    className="input"
                                    style={{ width: "100%" }}
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                >
                                    <option value="">Select room</option>
                                    {rooms.map((room) => (
                                        <option key={room.Id} value={room.Id}>
                                            {room.Name} • Capacity {room.Capacity} • {room.Is3D ? "3D" : "2D"} •{" "}
                                            {room.IsDolbyAtmos ? "Dolby Atmos" : "Standard Audio"} •{" "}
                                            {room.IsIMAX ? "IMAX" : "Standard Screen"}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {selectedRoom ? (
                                <div className="reservationMeta adminRoomPreview">
                                    <div className="reservationMetaItem">
                                        <span className="muted">Room</span>
                                        <strong>{selectedRoom.Name}</strong>
                                    </div>
                                    <div className="reservationMetaItem">
                                        <span className="muted">Capacity</span>
                                        <strong>{selectedRoom.Capacity}</strong>
                                    </div>
                                    <div className="reservationMetaItem">
                                        <span className="muted">Projection</span>
                                        <strong>{selectedRoom.Is3D ? "3D" : "2D"}</strong>
                                    </div>
                                    <div className="reservationMetaItem">
                                        <span className="muted">Audio / Screen</span>
                                        <strong>
                                            {selectedRoom.IsDolbyAtmos ? "Dolby Atmos" : "Standard"} •{" "}
                                            {selectedRoom.IsIMAX ? "IMAX" : "Standard"}
                                        </strong>
                                    </div>
                                </div>
                            ) : null}

                            <label className="label">
                                Start time
                                <input
                                    className="input"
                                    style={{ width: "100%" }}
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </label>

                            <label className="label">
                                Ticket price
                                <input
                                    className="input"
                                    style={{ width: "100%" }}
                                    type="number"
                                    min="1"
                                    step="0.5"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </label>

                            <button className="btn btnPrimary" type="submit" disabled={creatingScreening}>
                                {creatingScreening ? "Creating..." : "Create Screening"}
                            </button>
                        </form>
                    </div>
                ) : null}

                <div className="section">
                    <h3>4. Existing screenings</h3>

                    {screeningsLoading ? (
                        <div className="muted">Loading screenings...</div>
                    ) : screenings.length === 0 ? (
                        <div className="emptyState">
                            <div className="emptyStateTitle">No screenings yet</div>
                            <div className="muted">Create a screening to see it here.</div>
                        </div>
                    ) : (
                        <div className="screenings adminResultsList">
                            {screenings.map((s) => (
                                <div key={s.Id} className="screening-item">
                                    <div>
                                        <div className="row-title">{s.Movie?.Title || "Unknown movie"}</div>
                                        <div className="muted small">
                                            {formatDateTime(s.StartTime)} • Room: {s.Room?.Name || s.RoomId} • Price: €
                                            {s.Price}
                                        </div>
                                        <div className="muted small">
                                            {s.Room?.Is3D ? "3D" : "2D"} •{" "}
                                            {s.Room?.IsDolbyAtmos ? "Dolby Atmos" : "Standard Audio"} •{" "}
                                            {s.Room?.IsIMAX ? "IMAX" : "Standard Screen"}
                                        </div>
                                    </div>

                                    <div className="price">€{s.Price}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}