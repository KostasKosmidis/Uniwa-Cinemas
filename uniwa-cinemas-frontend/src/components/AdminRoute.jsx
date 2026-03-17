import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Δεν έχει κάνει login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Έχει login αλλά δεν είναι admin
    if (role !== "admin") {
        return (
            <div className="page">
                <div
                    className="details-card"
                    style={{ maxWidth: 620, margin: "40px auto", textAlign: "center" }}
                >
                    <h1 className="h1">Access Denied</h1>
                    <p className="muted">
                        You do not have permission to access the admin page.
                    </p>
                </div>
            </div>
        );
    }

    return children;
}