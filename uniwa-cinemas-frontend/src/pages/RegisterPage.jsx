import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");
        setMsg("");

        try {
            setLoading(true);

            await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            setMsg("Account created successfully ✅");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (e) {
            setErr(e.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="details-card" style={{ maxWidth: 460, margin: "0 auto" }}>
                <h1 className="h1">Register</h1>

                {msg ? <div className="alert success">{msg}</div> : null}
                {err ? <div className="alert">{err}</div> : null}

                <form className="form" onSubmit={onSubmit}>
                    <label className="label">
                        Username
                        <input
                            className="input"
                            style={{ width: "100%" }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>

                    <label className="label">
                        Password
                        <input
                            className="input"
                            style={{ width: "100%" }}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <button className="btn btnPrimary" disabled={loading}>
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                <div style={{ marginTop: 16 }} className="muted">
                    Already have an account?{" "}
                    <Link to="/login" className="link" style={{ padding: 0 }}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}