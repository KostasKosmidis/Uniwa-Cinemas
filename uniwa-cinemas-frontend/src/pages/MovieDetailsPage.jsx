import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getMovie } from "../Services/moviesApi";
import { getScreeningsByMovie } from "../Services/screeningsApi";
import { createReservation } from "../Services/reservationsApi";
import { omdbByTitle } from "../api/omdb";

function fmtDate(iso) {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
}

export default function MovieDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [movie, setMovie] = useState(null);
    const [omdb, setOmdb] = useState(null);
    const [screenings, setScreenings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedScreening, setSelectedScreening] = useState(null);
    const [seats, setSeats] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState("");
    const [bookingError, setBookingError] = useState("");

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                setBookingSuccess("");
                setBookingError("");

                const m = await getMovie(id);
                if (!alive) return;
                setMovie(m);

                const [om, scr] = await Promise.all([
                    omdbByTitle(m.Title, m.Year),
                    getScreeningsByMovie(id),
                ]);

                if (!alive) return;
                setOmdb(om);
                setScreenings(scr || []);
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
    }, [id]);

    const poster = omdb?.Poster && omdb.Poster !== "N/A" ? omdb.Poster : null;

    const chips = useMemo(() => {
        if (!movie) return null;
        return (
            <div className="chips">
                <span className="chip">⏱ {movie.DurationMinutes} min</span>
                <span className="chip">⭐ {movie.Rating}</span>
                {omdb?.Year && omdb.Year !== "N/A" ? <span className="chip">📅 {omdb.Year}</span> : null}
                {omdb?.Genre && omdb.Genre !== "N/A" ? <span className="chip">🎭 {omdb.Genre}</span> : null}
                {omdb?.imdbRating && omdb.imdbRating !== "N/A" ? (
                    <span className="chip">IMDb {omdb.imdbRating}</span>
                ) : null}
            </div>
        );
    }, [movie, omdb]);

    function openBookingModal(screening) {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login", {
                state: {
                    from: location.pathname,
                    message: "Please login to complete your reservation.",
                },
            });
            return;
        }

        setSelectedScreening(screening);
        setSeats(1);
        setBookingError("");
        setBookingSuccess("");
    }

    function closeBookingModal() {
        setSelectedScreening(null);
        setSeats(1);
        setIsBooking(false);
        setBookingError("");
    }

    async function confirmBooking() {
        if (!selectedScreening) return;

        try {
            setIsBooking(true);
            setBookingError("");

            const payload = {
                screeningId: selectedScreening.Id,
                seats: Number(seats),
            };

            await createReservation(payload);

            setBookingSuccess("Reservation created successfully ✅");
            closeBookingModal();
        } catch (e) {
            setBookingError(e.message || "Booking failed");
        } finally {
            setIsBooking(false);
        }
    }

    if (loading) {
        return (
            <div className="page">
                <div className="muted">Loading…</div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="page">
                <div className="muted">Movie not found.</div>
            </div>
        );
    }

    const totalPrice =
        selectedScreening && seats
            ? Number(selectedScreening.Price || 0) * Number(seats)
            : 0;

    return (
        <div className="page">
            <Link to="/movies" className="backlink">
                ← Back to Movies
            </Link>

            {bookingSuccess ? <div className="alert success">{bookingSuccess}</div> : null}

            <div className="details-layout">
                <div className="details-poster">
                    {poster ? (
                        <img className="details-poster-img" src={poster} alt={movie.Title} />
                    ) : (
                        <div className="poster-fallback big">
                            <div className="poster-fallback-inner">
                                <span className="emoji">🎬</span>
                                <span>No poster</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="details-card">
                    <h1 className="details-title">{movie.Title}</h1>
                    {chips}

                    <div className="section">
                        <h3>Description</h3>
                        <p className="muted">{movie.Description}</p>
                    </div>

                    {omdb?.Plot && omdb.Plot !== "N/A" ? (
                        <div className="section">
                            <h3>OMDb Plot (Full)</h3>
                            <p className="muted">{omdb.Plot}</p>
                        </div>
                    ) : null}

                    <div className="section">
                        <h3>Showtimes</h3>

                        {screenings.length === 0 ? (
                            <div className="emptyState">
                                <div className="emptyStateTitle">No showtimes available</div>
                                <div className="muted">
                                    This movie does not have screenings yet. Check back later or choose another movie.
                                </div>
                            </div>
                        ) : (
                            <div className="screenings">
                                {screenings.map((s) => (
                                    <div key={s.Id} className="screening-item">
                                        <div>
                                            <div className="screening-time">{fmtDate(s.StartTime)}</div>
                                            <div className="muted">
                                                Room: {s.Room?.Name} • {s.Room?.Is3D ? "3D" : "2D"} •{" "}
                                                {s.Room?.IsDolbyAtmos ? "Dolby Atmos" : "Standard"}
                                            </div>
                                        </div>

                                        <div className="screening-right">
                                            <div className="price">€{s.Price}</div>
                                            <button className="btn btnPrimary" onClick={() => openBookingModal(s)}>
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <Link className="btn btnGhost" to="/my-reservations">
                                View My Reservations
                            </Link>
                            <button className="btn btnGhost" onClick={() => navigate("/movies")}>
                                Browse More Movies
                            </button>
                        </div>
                    </div>

                    {omdb?.Director && omdb.Director !== "N/A" ? (
                        <div className="section">
                            <h3>Director</h3>
                            <p className="muted">{omdb.Director}</p>
                        </div>
                    ) : null}

                    {omdb?.Actors && omdb.Actors !== "N/A" ? (
                        <div className="section">
                            <h3>Actors</h3>
                            <p className="muted">{omdb.Actors}</p>
                        </div>
                    ) : null}
                </div>
            </div>

            {selectedScreening ? (
                <div className="modal-backdrop" onClick={closeBookingModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modalTitle">Confirm Reservation</h3>

                        <div className="bookingSummary">
                            <div className="bookingSummaryRow">
                                <span className="muted">Movie</span>
                                <strong>{movie.Title}</strong>
                            </div>

                            <div className="bookingSummaryRow">
                                <span className="muted">Showtime</span>
                                <strong>{fmtDate(selectedScreening.StartTime)}</strong>
                            </div>

                            <div className="bookingSummaryRow">
                                <span className="muted">Room</span>
                                <strong>{selectedScreening.Room?.Name}</strong>
                            </div>

                            <div className="bookingSummaryRow">
                                <span className="muted">Format</span>
                                <strong>
                                    {selectedScreening.Room?.Is3D ? "3D" : "2D"} •{" "}
                                    {selectedScreening.Room?.IsDolbyAtmos ? "Dolby Atmos" : "Standard"}
                                </strong>
                            </div>

                            <div className="bookingSummaryRow">
                                <span className="muted">Price per ticket</span>
                                <strong>€{selectedScreening.Price}</strong>
                            </div>
                        </div>

                        <div className="bookingRow">
                            <div className="bookingSeatsBlock">
                                <span className="bookingSeatsLabel">Quantity of tickets</span>
                                <input
                                    className="input bookingSeatsInput"
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={seats}
                                    onChange={(e) => setSeats(e.target.value)}
                                />
                            </div>

                            <div className="bookingTotal">
                                <span className="muted">Total</span>
                                <strong>€{totalPrice}</strong>
                            </div>
                        </div>

                        {bookingError ? <div className="alert">{bookingError}</div> : null}

                        <div className="modal-actions">
                            <button className="btn btnGhost" onClick={closeBookingModal} disabled={isBooking}>
                                Cancel
                            </button>
                            <button className="btn btnPrimary" onClick={confirmBooking} disabled={isBooking}>
                                {isBooking ? "Booking..." : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}