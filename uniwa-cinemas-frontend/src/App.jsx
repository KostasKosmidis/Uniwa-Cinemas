import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import LoginPage from "./pages/LoginPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/movies" replace />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />

                <Route
                    path="/my-reservations"
                    element={
                        <ProtectedRoute>
                            <MyReservationsPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/movies" replace />} />
            </Routes>
        </>
    );
}