import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Paper, Alert } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import Layout from "../components/Layout";
import BookingCard from "../components/BookingCard";
import { type Booking } from "../utils/api/bookingServices";
import { useBookings, useDeleteBooking } from "../utils/api/useBookingMutation";
import useAuth from "../utils/Contexts/useAuth";

const MyBookingsPage: React.FC = () => {
  const { RoleId } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: deleteBooking } = useDeleteBooking();
  const { data: bookingsQuery, isLoading } = useBookings(RoleId == 1);
  
  useEffect(() => {
    if (bookingsQuery) {
      setBookings(bookingsQuery);
    }
  }, [bookingsQuery]);

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking(id);
      setBookings(bookings.filter((b) => b.Id !== id));
    } catch (error) {
      setError("Помилка при скасуванні бронювання");
    }
  };

  return (
    <Layout currentPage="bookings">
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Мої бронювання
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
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <CalendarMonth
              sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              У вас поки немає бронювань
            </Typography>
          </Paper>
        ) : (
          <Box>
            {bookings.map((booking) => (
              <BookingCard
                key={booking.Id}
                booking={booking}
                onDelete={handleDeleteBooking}
              />
            ))}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default MyBookingsPage;
