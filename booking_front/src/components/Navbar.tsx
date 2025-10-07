// components/common/Navbar.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Hotel, Logout, CalendarMonth, BarChart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuth from "../utils/Contexts/useAuth";

interface NavbarProps {
  currentPage?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const { RoleId, logout } = useAuth();
  const isAdmin = RoleId === 1;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Hotel sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Hotel Booking
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          {!isAdmin && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/hotels")}
                sx={{
                  backgroundColor:
                    currentPage === "hotels"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                Готелі
              </Button>
              <Button
                color="inherit"
                startIcon={<CalendarMonth />}
                onClick={() => navigate("/my-bookings")}
                sx={{
                  backgroundColor:
                    currentPage === "bookings"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                Мої бронювання
              </Button>
            </>
          )}

          {isAdmin && (
            <>
              <Button
                color="inherit"
                startIcon={<Hotel />}
                onClick={() => navigate("/admin/hotels")}
                sx={{
                  backgroundColor:
                    currentPage === "admin-hotels"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                Готелі
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/admin/rooms")}
                sx={{
                  backgroundColor:
                    currentPage === "admin-rooms"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                Номери
              </Button>
              <Button
                color="inherit"
                startIcon={<CalendarMonth />}
                onClick={() => navigate("/admin/bookings")}
                sx={{
                  backgroundColor:
                    currentPage === "admin-bookings"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                Бронювання
              </Button>
              <Button
                color="inherit"
                startIcon={<BarChart />}
                onClick={() => navigate("/admin/statistics")}
                sx={{
                  backgroundColor:
                    currentPage === "statistics"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                Статистика
              </Button>
            </>
          )}
        </Box>

        <Button
          color="inherit"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ ml: 2 }}
        >
          Вийти
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
