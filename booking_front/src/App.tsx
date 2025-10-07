import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import useAuth from "./utils/Contexts/useAuth";
import {
  SingedIn as ProtectedRoute,
  SingedOut as PublicRoute,
} from "./utils/Contexts/UserContext";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";

// User Pages
import HotelsPage from "./pages/HotelsPage";
import RoomsPage from "./pages/RoomsPage";
import MyBookingsPage from "./pages/MyBookingsPage";

// Admin Pages
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminStatisticsPage from "./pages/AdminStatisticsPage";
import AdminHotelsPage from "./pages/AdminHotelsPage";
import AdminRoomsPage from "./pages/AdminRoomsPage";

function App() {
  const { Id, RoleId } = useAuth();
  const isAdmin = RoleId === 1;

  return (
    <Box>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/hotels"
            element={
              <ProtectedRoute>
                {isAdmin ? (
                  <Navigate to="/admin/bookings" replace />
                ) : (
                  <HotelsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/:hotelId/rooms"
            element={
              <ProtectedRoute>
                {isAdmin ? (
                  <Navigate to="/admin/bookings" replace />
                ) : (
                  <RoomsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                {isAdmin ? (
                  <Navigate to="/admin/bookings" replace />
                ) : (
                  <MyBookingsPage />
                )}
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/hotels"
            element={
              <ProtectedRoute>
                {!isAdmin ? (
                  <Navigate to="/hotels" replace />
                ) : (
                  <AdminHotelsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute>
                {!isAdmin ? (
                  <Navigate to="/hotels" replace />
                ) : (
                  <AdminRoomsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                {!isAdmin ? (
                  <Navigate to="/hotels" replace />
                ) : (
                  <AdminBookingsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/statistics"
            element={
              <ProtectedRoute>
                {!isAdmin ? (
                  <Navigate to="/hotels" replace />
                ) : (
                  <AdminStatisticsPage />
                )}
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="*"
            element={
              Id ? (
                <Navigate to={isAdmin ? "/admin/hotels" : "/hotels"} replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
