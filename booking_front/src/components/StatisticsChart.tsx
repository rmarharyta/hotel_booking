// components/admin/StatisticsChart.tsx
import React from "react";
import { Box, Typography, Paper, LinearProgress } from "@mui/material";
import { BookingStatistics } from "../utils/api/statisticsServices";

interface StatisticsChartProps {
  statistics: BookingStatistics[];
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ statistics }) => {
  const maxRevenue = Math.max(...statistics.map((s) => s.totalRevenue), 1);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Дохід по готелям
      </Typography>

      <Box sx={{ mt: 3 }}>
        {statistics.map((stat, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body1" fontWeight="medium">
                {stat.hotelName}
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="primary">
                ₴{stat.totalRevenue.toLocaleString()}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={(stat.totalRevenue / maxRevenue) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                },
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
              {stat.totalBookings}{" "}
              {stat.totalBookings === 1 ? "бронювання" : "бронювань"}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default StatisticsChart;
