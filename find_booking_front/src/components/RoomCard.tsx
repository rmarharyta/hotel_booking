// components/user/RoomCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { People } from "@mui/icons-material";
import { type Room } from "../utils/api/roomServices";

interface RoomCardProps {
  room: Room;
  nights: number;
  onBook: (room: Room) => void;
  disabled?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  nights,
  onBook,
  disabled,
}) => {
  const totalPrice = room.PricePerNight * nights;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: disabled ? "none" : "translateY(-4px)",
          boxShadow: disabled ? 1 : 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h3" fontWeight="bold">
            Номер {room.RoomNumber}
          </Typography>
          <Chip
            icon={<People />}
            label={`До ${room.Capacity} осіб`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
          <Typography
            variant="h4"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            ₴{room.PricePerNight}
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              /ніч
            </Typography>
          </Typography>

          {nights > 0 && (
            <Typography variant="body2" color="text.secondary">
              Всього за {nights}{" "}
              {nights === 1 ? "ніч" : nights < 5 ? "ночі" : "ночей"}: ₴
              {totalPrice}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onBook(room)}
          disabled={disabled}
        >
          Забронювати
        </Button>
      </CardActions>
    </Card>
  );
};

export default RoomCard;
