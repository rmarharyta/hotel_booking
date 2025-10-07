import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import RoomCard from "../components/RoomCard";
import { useRooms } from "../utils/api/useRoomMutation";
import { useAddBooking } from "../utils/api/useBookingMutation";
import { Room } from "../utils/api/roomServices";

const RoomsPage: React.FC = () => {
      const { hotelId } = useParams<{ hotelId: string }>();

  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { mutateAsync: addBookingMutate, isPending: isPendingAddBooking } =
    useAddBooking();

  const { data: roomsQuery, isLoading } = useRooms(hotelId);
  useEffect(() => {
    if (roomsQuery) {
      setRooms(roomsQuery);
    }
  }, [roomsQuery]);

  const calculateNights = (): number => {
    if (!checkInDate || !checkOutDate) return 0;
    const days = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days > 0 ? days : 0;
  };

  const handleBookRoom = async (room: Room) => {
    if (!checkInDate || !checkOutDate) {
      setError("Оберіть дати заїзду та виїзду");
      return;
    }

    const nights = calculateNights();
    if (nights <= 0) {
      setError("Некоректні дати");
      return;
    }

    try {
      addBookingMutate({
        roomId: room.Id,
        checkInDate,
        checkOutDate,
        totalPrice: room.PricePerNight * nights,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/my-bookings");
      }, 1500);
    } catch (error) {
      setError("Помилка при бронюванні");
    }
  };

  const nights = calculateNights();
  const today = new Date().toISOString().split("T")[0];

  return (
    <Layout>
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/hotels")}
          sx={{ mb: 3 }}
        >
          Назад до готелів
        </Button>

        <Typography variant="h4" gutterBottom fontWeight="bold">
          Оберіть номер
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Бронювання успішно створено!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              type="date"
              label="Дата заїзду"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
            />
            <TextField
              fullWidth
              type="date"
              label="Дата виїзду"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: checkInDate || today }}
            />
          </Box>
          {nights > 0 && (
            <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
              Тривалість: {nights}{" "}
              {nights === 1 ? "ніч" : nights < 5 ? "ночі" : "ночей"}
            </Typography>
          )}
        </Paper>

        {isPendingAddBooking ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : rooms.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Номери не знайдено
            </Typography>
          </Paper>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={3}>
            {rooms.map((room) => (
              <Box
                key={room.Id}
                flex="1 1 calc(33.333% - 16px)"
                minWidth="280px"
              >
                <RoomCard
                  room={room}
                  nights={nights}
                  onBook={handleBookRoom}
                  disabled={nights === 0}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default RoomsPage;
