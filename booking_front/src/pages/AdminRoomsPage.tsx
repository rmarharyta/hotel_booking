import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import Layout from "../components/Layout";
import { Room } from "../utils/api/roomServices";
import { Hotel } from "../utils/api/hotelServices";
import { useHotels } from "../utils/api/useHotelMutation";
import {
  useAddRoom,
  useDeleteRoom,
  useRooms,
  useUpdateRoom,
} from "../utils/api/useRoomMutation";

const AdminRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    hotelId: "",
    roomNumber: "",
    capacity: 1,
    pricePerNight: 0,
  });

  const { mutateAsync: deleteMutate } = useDeleteRoom();
  const { mutateAsync: addMutate, isPending: isPendingAddTemplates } =
    useAddRoom();

  const { mutateAsync: updateMutate, isPending: isPendingChangeTemplate } =
    useUpdateRoom();

  const { data: hotelsQuery } = useHotels();
  useEffect(() => {
    if (hotelsQuery) {
      setHotels(hotelsQuery);
    }
  }, [hotelsQuery]);

  const { data: roomsQuery } = useRooms();
  useEffect(() => {
    if (roomsQuery) {
      setRooms(roomsQuery);
    }
  }, [roomsQuery]);

  const getHotelName = (hotelId: string) => {
    return hotels.find((h) => h.Id === hotelId)?.Name || "Невідомий готель";
  };

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        hotelId: room.HotelId,
        roomNumber: room.RoomNumber,
        capacity: room.Capacity,
        pricePerNight: room.PricePerNight,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        hotelId: "",
        roomNumber: "",
        capacity: 1,
        pricePerNight: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRoom(null);
    setFormData({ hotelId: "", roomNumber: "", capacity: 1, pricePerNight: 0 });
  };

  const handleSubmit = async () => {
    try {
      if (editingRoom) {
        updateMutate({
          id: editingRoom.Id,
          roomNumber: formData.roomNumber,
          capacity: formData.capacity,
          pricePerNight: formData.pricePerNight,
        });
        setRooms(
          rooms.map((p) =>
            p.Id === editingRoom.Id
              ? {
                  ...p,
                  roomNumber: formData.roomNumber,
                  capacity: formData.capacity,
                  pricePerNight: formData.pricePerNight,
                }
              : p
          )
        );
      } else {
        addMutate({
          hotelId: formData.hotelId,
          roomNumber: formData.roomNumber,
          capacity: formData.capacity,
          pricePerNight: formData.pricePerNight,
        });
        setRooms(
          (room) =>
            [
              ...room,
              {
                hotelId: formData.hotelId,
                roomNumber: formData.roomNumber,
                capacity: formData.capacity,
                pricePerNight: formData.pricePerNight,
              },
            ] as Room[]
        );
      }
      handleCloseDialog();
    } catch (error) {
      setError("Помилка збереження номера");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей номер?")) {
      try {
        await deleteMutate(id);
        setRooms(rooms.filter((p) => p.Id !== id));
      } catch (error) {
        setError("Помилка видалення номера");
      }
    }
  };

  return (
    <Layout currentPage="admin-rooms">
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Управління номерами
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Додати номер
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>
                    <Typography fontWeight="bold">Готель</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Номер</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Місткість</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">Ціна/ніч</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">Дії</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow
                    key={room.Id}
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell>{getHotelName(room.HotelId)}</TableCell>
                    <TableCell>{room.RoomNumber}</TableCell>
                    <TableCell>{room.Capacity} осіб</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="medium" color="primary">
                        ₴{room.PricePerNight}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(room)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(room.Id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingRoom ? "Редагувати номер" : "Додати номер"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                select
                label="Готель"
                value={formData.hotelId}
                onChange={(e) =>
                  setFormData({ ...formData, hotelId: e.target.value })
                }
                disabled={!!editingRoom}
                required
              >
                {hotels.map((hotel) => (
                  <MenuItem key={hotel.Id} value={hotel.Id}>
                    {hotel.Name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Номер кімнати"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                type="number"
                label="Місткість (осіб)"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value) || 1,
                  })
                }
                inputProps={{ min: 1, max: 10 }}
                required
              />
              <TextField
                fullWidth
                type="number"
                label="Ціна за ніч (₴)"
                value={formData.pricePerNight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerNight: parseFloat(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0, step: 100 }}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Скасувати</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={
                !formData.hotelId ||
                !formData.roomNumber ||
                formData.pricePerNight <= 0
              }
            >
              {editingRoom ? "Зберегти" : "Додати"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default AdminRoomsPage;
