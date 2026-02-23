import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function NavBar() {
    const navigate = useNavigate();
    const { isAuthed, logout } = useAuth();

    return (
        <header className="nav">
            <div className="container navInner">
                <Link to="/" className="brand">
                    <span style={{ fontSize: 18 }}>🎬</span>
                    UniWa Cinemas
                    <span className="badge">MS SQL • Node • React</span>
                </Link>

                <nav className="navLinks">
                    <Link className="link" to="/">Movies</Link>

                    {!isAuthed ? (
                        <>
                            <Link className="link" to="/login">Login</Link>
                            <Link className="link" to="/register">Register</Link>
                        </>
                    ) : (
                        <button className="btn" onClick={() => { logout(); navigate("/login"); }}>
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}