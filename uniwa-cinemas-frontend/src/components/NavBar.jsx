import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../services/api";
import { logout } from "../services/authApi";

export default function Navbar() {
    const token = getToken();
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="nav">
            <div className="nav-inner">
                <Link className="brand" to="/movies">
                    🎬 <span>UniWa Cinemas</span>
                </Link>

                <nav className="nav-links">
                    <Link to="/movies">Movies</Link>
                    {token ? (
                        <>
                            <Link to="/my-reservations">My Reservations</Link>
                            <button className="btn btn-ghost" onClick={onLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}