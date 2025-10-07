// pages/admin/AdminHotelsPage.tsx
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
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete, LocationOn } from "@mui/icons-material";
import Layout from "../components/Layout";
import { Hotel } from "../utils/api/hotelServices";
import {
  useAddHotel,
  useDeleteHotel,
  useHotels,
  useUpdateHotel,
} from "../utils/api/useHotelMutation";

const AdminHotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
  });
  const { mutateAsync: deleteMutate } = useDeleteHotel();
  const { mutateAsync: addMutate } = useAddHotel();
  const { mutateAsync: updateMutate } = useUpdateHotel();

  const { data: hotelsQuery, isLoading } = useHotels();
  useEffect(() => {
    if (hotelsQuery) {
      setHotels(hotelsQuery);
    }
  }, [hotelsQuery]);

  const handleOpenDialog = (hotel?: Hotel) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.Name,
        city: hotel.City,
        address: hotel.Address,
        description: hotel.Description,
      });
    } else {
      setEditingHotel(null);
      setFormData({ name: "", city: "", address: "", description: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingHotel(null);
    setFormData({ name: "", city: "", address: "", description: "" });
  };

  const handleSubmit = async () => {
    try {
      if (editingHotel) {
        await updateMutate({
          id: editingHotel.Id,
          name: formData.name,
          city: formData.city,
          address: formData.address,
          description: formData.description,
        });
        setHotels(
          hotels.map((p) =>
            p.Id === editingHotel.Id
              ? {
                  ...p,
                  name: formData.name,
                  city: formData.city,
                  address: formData.address,
                  description: formData.description,
                }
              : p
          )
        );
      } else {
        await addMutate(formData);
        setHotels(
          (hotels) =>
            [
              ...hotels,
              {
                name: formData.name,
                city: formData.city,
                address: formData.address,
                description: formData.description,
              },
            ] as Hotel[]
        );
      }
      handleCloseDialog();
    } catch (error) {
      setError("Помилка збереження готелю");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей готель?")) {
      try {
        await deleteMutate(id);
        setHotels(hotels.filter((p) => p.Id !== id));
      } catch (error) {
        setError("Помилка видалення готелю");
      }
    }
  };

  return (
    <Layout currentPage="admin-hotels">
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
            Управління готелями
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Додати готель
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={3}>
            {hotels.map((hotel) => (
              <Box
                key={hotel.Id}
                flex="1 1 calc(33.333% - 16px)" // 3 колонки на md+
                minWidth="280px" // мінімальна ширина для xs/sm
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {hotel.Name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOn
                        sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {hotel.City}, {hotel.Address}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {hotel.Description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(hotel)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(hotel.Id)}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingHotel ? "Редагувати готель" : "Додати готель"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="Назва готелю"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Місто"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Адреса"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Опис"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                multiline
                rows={3}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Скасувати</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!formData.name || !formData.city || !formData.address}
            >
              {editingHotel ? "Зберегти" : "Додати"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default AdminHotelsPage;
