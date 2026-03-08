import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyReservations, deleteReservation } from "../services/reservationsApi";

function formatDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString();
}

export default function MyReservationsPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");
    const [cancellingId, setCancellingId] = useState("");

    const load = async () => {
        setErr("");
        setOk("");
        setLoading(true);

        try {
            const data = await getMyReservations();
            setRows(Array.isArray(data) ? data : []);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const totalReservations = useMemo(() => rows.length, [rows]);

    const onCancel = async (id) => {
        setErr("");
        setOk("");
        try {
            setCancellingId(id);
            await deleteReservation(id);
            setOk("Reservation cancelled ✅");
            await load();
        } catch (e) {
            setErr(e.message);
        } finally {
            setCancellingId("");
        }
    };

    return (
        <main className="page">
            <div className="page-head">
                <h1 className="h1">🎟️ My Reservations</h1>
                <p className="muted">
                    Manage your bookings. Total reservations: <strong>{totalReservations}</strong>
                </p>
            </div>

            {loading ? <div className="muted">Loading...</div> : null}
            {err ? <div className="alert">{err}</div> : null}
            {ok ? <div className="alert success">{ok}</div> : null}

            <div className="stack">
                {rows.map((r) => {
                    const total = Number(r.Seats || 0) * Number(r.Screening?.Price || 0);

                    return (
                        <div className="card reservationCard" key={r.Id}>
                            <div className="reservationTop">
                                <div>
                                    <div className="row-title">{r.Screening?.Movie?.Title ?? "Movie"}</div>
                                    <div className="muted small">
                                        {formatDateTime(r.Screening?.StartTime)}
                                    </div>
                                </div>

                                <div className="reservationActions">
                                    <button
                                        className="btn btnDanger"
                                        onClick={() => onCancel(r.Id)}
                                        disabled={cancellingId === r.Id}
                                    >
                                        {cancellingId === r.Id ? "Cancelling..." : "Cancel"}
                                    </button>
                                </div>
                            </div>

                            <div className="reservationMeta">
                                <div className="reservationMetaItem">
                                    <span className="muted">Room</span>
                                    <strong>{r.Screening?.Room?.Name ?? "-"}</strong>
                                </div>

                                <div className="reservationMetaItem">
                                    <span className="muted">Seats</span>
                                    <strong>{r.Seats}</strong>
                                </div>

                                <div className="reservationMetaItem">
                                    <span className="muted">Price / Seat</span>
                                    <strong>€{r.Screening?.Price ?? 0}</strong>
                                </div>

                                <div className="reservationMetaItem">
                                    <span className="muted">Total</span>
                                    <strong>€{total}</strong>
                                </div>
                            </div>

                            <div className="muted small reservationId">Reservation ID: {r.Id}</div>
                        </div>
                    );
                })}

                {!loading && rows.length === 0 ? (
                    <div className="emptyState">
                        <div className="emptyStateTitle">No reservations yet</div>
                        <div className="muted">Book a showtime to see your reservations here.</div>
                        <div style={{ marginTop: 12 }}>
                            <Link className="btn btnPrimary" to="/movies">
                                Browse Movies
                            </Link>
                        </div>
                    </div>
                ) : null}
            </div>
        </main>
    );
}