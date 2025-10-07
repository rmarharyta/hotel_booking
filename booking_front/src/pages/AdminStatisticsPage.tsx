import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import Layout from "../components/Layout";
import StatisticsChart from "../components/StatisticsChart";
import { BookingStatistics } from "../utils/api/statisticsServices";
import { useBookingStatistics } from "../utils/api/useBookingMutation";

const AdminStatisticsPage: React.FC = () => {
    const [statistics, setStatistics] = useState<BookingStatistics[]>([]);
    
  const [error, setError] = useState<string | null>(null);
  const [hotelId, setHotelId] = useState("");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");

  const { data: bookingsQuery, isLoading } = useBookingStatistics(hotelId, startDate, endDate);
  useEffect(() => {
    if (bookingsQuery) {
      setStatistics(bookingsQuery);
    }
  }, [bookingsQuery]);



  const totalRevenue = statistics.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalBookings = statistics.reduce((sum, s) => sum + s.totalBookings, 0);

  return (
    <Layout currentPage="statistics">
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Статистика бронювань
        </Typography>

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
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="ID готелю"
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
              placeholder="Введіть ID готелю"
            />
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
          </Box>
        </Paper>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : statistics.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              {hotelId
                ? "Статистики не знайдено"
                : "Оберіть готель для перегляду статистики"}
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
                  ₴{totalRevenue.toLocaleString()}
                </Typography>
              </Paper>
              <Paper sx={{ p: 3, flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Всього бронювань
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {totalBookings}
                </Typography>
              </Paper>
            </Box>

            <StatisticsChart statistics={statistics} />
          </>
        )}
      </Box>
    </Layout>
  );
};

export default AdminStatisticsPage;