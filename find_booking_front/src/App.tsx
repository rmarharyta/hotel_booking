import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import useAuth from "./utils/Contexts/useAuth";
import {
  SingedIn as ProtectedRoute,
  SingedOut as PublicRoute,
} from "./utils/Contexts/UserContext";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";

import HotelsPage from "./pages/HotelsPage";
import RoomsPage from "./pages/RoomsPage";
import MyBookingsPage from "./pages/MyBookingsPage";

import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminStatisticsPage from "./pages/AdminStatisticsPage";
import AdminHotelsPage from "./pages/AdminHotelsPage";
import AdminRoomsPage from "./pages/AdminRoomsPage";

function App() {
  const { Id, RoleId } = useAuth();
  const isAdmin = Number(RoleId) === 1;

  return (
    <Box>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
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
          <Route
            path="/"
            element={
              Id ? (
                <Navigate to={isAdmin ? "/admin/hotels" : "/hotels"} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default redirect */}
          <Route
            path="*"
            element={
              Id ? (
                <Navigate to={isAdmin ? "/admin/hotels" : "/hotels"} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
