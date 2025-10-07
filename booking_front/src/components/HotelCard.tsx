// components/user/HotelCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { LocationOn, Hotel as HotelIcon } from "@mui/icons-material";
import { Hotel } from "../utils/api/hotelServices";

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          height: 200,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HotelIcon sx={{ fontSize: 80, color: "white", opacity: 0.5 }} />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
          {hotel.Name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOn sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {hotel.City}, {hotel.Address}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {hotel.Description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button fullWidth variant="contained" onClick={() => onSelect(hotel)}>
          Переглянути номери
        </Button>
      </CardActions>
    </Card>
  );
};

export default HotelCard;
