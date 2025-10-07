import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Layout from "../components/Layout";
import { type BookingStatistics } from "../utils/api/statisticsServices";
import { useBookingStatistics } from "../utils/api/useBookingMutation";
import type { Hotel } from "../utils/api/hotelServices";
import { useHotels } from "../utils/api/useHotelMutation";

const AdminStatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<BookingStatistics[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [hotelId, setHotelId] = useState("");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");

  const [queryParams, setQueryParams] = useState({
    hotelId: "",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  });

  const { data: hotelsQuery } = useHotels();
  useEffect(() => {
    if (hotelsQuery) {
      setHotels(hotelsQuery);
    }
  }, [hotelsQuery]);

  const {
    data: BookingQuery,
    isLoading,
    error,
  } = useBookingStatistics(
    queryParams.hotelId,
    queryParams.startDate,
    queryParams.endDate
  );
  useEffect(() => {
    if (BookingQuery) {
      console.log("Statistics data received:", BookingQuery);
      setStatistics(BookingQuery);
    }
  }, [BookingQuery]);

  const handleSearch = () => {
    console.log("Searching with params:", { hotelId, startDate, endDate });

    if (!hotelId.trim()) {
      alert("Будь ласка, оберіть готель");
      return;
    }
    setQueryParams({
      hotelId: hotelId.trim(),
      startDate,
      endDate,
    });
  };

  const cleanNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const totalRevenue = statistics.reduce(
    (sum, s) => sum + cleanNumber(s.TotalRevenue),
    0
  );

  const totalBookings = statistics.reduce(
    (sum, s) => sum + cleanNumber(s.TotalBookings),
    0
  );

  return (
    <Layout currentPage="statistics">
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Статистика бронювань
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Помилка завантаження статистики:{" "}
            {error instanceof Error ? error.message : "Невідома помилка"}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: "flex-end",
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Готель</InputLabel>
              <Select
                value={hotelId}
                label="Готель"
                onChange={(e) => setHotelId(e.target.value)}
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>Оберіть готель</em>
                </MenuItem>
                {hotels?.map((hotel) => (
                  <MenuItem key={hotel.Id} value={hotel.Id}>
                    {hotel.Name} ({hotel.City})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Дата початку"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="date"
              label="Дата кінця"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              disabled={isLoading || !hotelId.trim()}
              sx={{ minWidth: 150, height: 56 }}
            >
              Пошук
            </Button>
          </Box>
        </Paper>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Завантаження статистики...</Typography>
          </Box>
        ) : !queryParams.hotelId ? (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Оберіть готель та період
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Натисніть "Пошук" для перегляду статистики
            </Typography>
          </Paper>
        ) : statistics.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Статистики не знайдено
            </Typography>
            <Typography variant="body2" color="text.secondary">
              За вказаний період немає бронювань для цього готелю
            </Typography>
          </Paper>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                mb: 4,
              }}
            >
              <Paper sx={{ p: 3, flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Загальний дохід
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  ₴{cleanNumber(totalRevenue).toLocaleString()}{" "}
                </Typography>
              </Paper>
              <Paper sx={{ p: 3, flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Всього бронювань
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {cleanNumber(totalBookings).toString()}{" "}
                </Typography>
              </Paper>
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default AdminStatisticsPage;
