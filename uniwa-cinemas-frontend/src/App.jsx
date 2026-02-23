import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage"; // ⭐ add
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
    return (
        <div>
            <NavBar />
            <Routes>
                <Route path="/" element={<MoviesPage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} /> {/* ⭐ add */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="*"
                    element={
                        <div style={{ padding: 16 }}>
                            <h2>404</h2>
                            <p>Page not found</p>
                        </div>
                    }
                />
            </Routes>
        </div>
    );
}