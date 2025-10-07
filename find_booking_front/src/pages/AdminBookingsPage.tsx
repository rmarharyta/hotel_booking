import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Paper, Alert } from "@mui/material";
import Layout from "../components/Layout";
import BookingsTable from "../components/BookingsTable";
import { type Booking } from "../utils/api/bookingServices";
import { useBookings } from "../utils/api/useBookingMutation";
import useAuth from "../utils/Contexts/useAuth";

const AdminBookingsPage: React.FC = () => {
  const { RoleId } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: bookingsQuery, isLoading } = useBookings(RoleId == 1);
  
  useEffect(() => {
    if (bookingsQuery) {
      setBookings(bookingsQuery);
    }
  }, [bookingsQuery]);

  return (
    <Layout currentPage="admin-bookings">
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Всі бронювання
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : bookings.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Бронювань не знайдено
            </Typography>
          </Paper>
        ) : (
          <BookingsTable bookings={bookings} />
        )}
      </Box>
    </Layout>
  );
};

export default AdminBookingsPage;
