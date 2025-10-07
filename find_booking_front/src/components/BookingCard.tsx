import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { type Booking } from "../utils/api/bookingServices";

interface BookingCardProps {
  booking: Booking;
  onDelete: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Бронювання #{booking.Id.substring(0, 8)}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Готель {booking.HotelName}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} sx={{ mt: 1 }}>
              <Box flex="1 1 100%" sx={{ flex: "1 1 33.333%" }}>
                <Typography variant="body2" color="text.secondary">
                  Заїзд
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(booking.CheckInDate)}
                </Typography>
              </Box>

              <Box flex="1 1 100%" sx={{ flex: "1 1 33.333%" }}>
                <Typography variant="body2" color="text.secondary">
                  Виїзд
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(booking.CheckOutDate)}
                </Typography>
              </Box>

              <Box flex="1 1 100%" sx={{ flex: "1 1 33.333%" }}>
                <Typography variant="body2" color="text.secondary">
                  Всього
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ₴{booking.TotalPrice}
                </Typography>
              </Box>
            </Box>
          </Box>

          <IconButton
            color="error"
            onClick={() => onDelete(booking.Id)}
            sx={{ ml: 2 }}
          >
            <Delete />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
