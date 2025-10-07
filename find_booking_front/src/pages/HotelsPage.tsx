// pages/user/HotelsPage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Layout from "../components/Layout";
import HotelCard from "../components/HotelCard";
import { type Hotel } from "../utils/api/hotelServices";
import { useNavigate } from "react-router-dom";
import { useHotels } from "../utils/api/useHotelMutation";

const HotelsPage: React.FC = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [searchCity, setSearchCity] = useState("");
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

  const { data: hotelsQuery, isLoading } = useHotels();
  useEffect(() => {
    if (hotelsQuery) {
      setHotels(hotelsQuery);
      setFilteredHotels(hotelsQuery);
    }
  }, [hotelsQuery]);

  useEffect(() => {
    if (searchCity.trim()) {
      setFilteredHotels(
        hotels.filter((h) =>
          h.City.toLowerCase().includes(searchCity.toLowerCase())
        )
      );
    } else {
      setFilteredHotels(hotels);
    }
  }, [searchCity, hotels]);

  const handleSelectHotel = (hotel: Hotel) => {
    navigate(`/hotels/${hotel.Id}/rooms`);
  };

  return (
    <Layout currentPage="hotels">
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Пошук готелів
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <TextField
            fullWidth
            label="Пошук за містом"
            variant="outlined"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            placeholder="Введіть назву міста..."
          />
        </Paper>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredHotels.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Готелі не знайдено
            </Typography>
          </Paper>
        ) : (
          <Box
            display="flex"
            flexWrap="wrap"
            gap={3}
          >
            {filteredHotels.map((hotel) => (
              <Box
                key={hotel.Id}
                flex="1 1 calc(33.333% - 16px)"
                minWidth="280px" 
              >
                <HotelCard hotel={hotel} onSelect={handleSelectHotel} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default HotelsPage;
