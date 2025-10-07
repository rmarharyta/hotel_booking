// components/admin/BookingsTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Booking } from "../utils/api/bookingServices";

interface BookingsTableProps {
  bookings: Booking[];
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>
              <Typography fontWeight="bold">ID</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Користувач</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Номер</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Заїзд</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Виїзд</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight="bold">Ціна</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.Id}
              sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
            >
              <TableCell>{booking.Id.substring(0, 8)}</TableCell>
              <TableCell>{booking.UserId?.substring(0, 8)}</TableCell>
              <TableCell>{booking.RoomId.substring(0, 8)}</TableCell>
              <TableCell>{formatDate(booking.CheckInDate)}</TableCell>
              <TableCell>{formatDate(booking.CheckOutDate)}</TableCell>
              <TableCell align="right">
                <Typography fontWeight="medium" color="primary">
                  ₴{booking.TotalPrice}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingsTable;
