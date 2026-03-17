import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/authApi";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const from = location.state?.from || "/movies";
    const infoMessage = location.state?.message || "";

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");

        try {
            setLoading(true);
            await login(username, password);
            navigate(from, { replace: true });
        } catch (e) {
            setErr(e.message || "Wrong Credentials");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="details-card" style={{ maxWidth: 460, margin: "0 auto" }}>
                <h1 className="h1">Login</h1>

                {infoMessage ? <div className="alert">{infoMessage}</div> : null}
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
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div style={{ marginTop: 16 }} className="muted">
                    Don’t have an account?{" "}
                    <Link to="/register" className="link" style={{ padding: 0 }}>
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}