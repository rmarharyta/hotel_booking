// import React from "react";
// import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
// import { Hotel, Logout, CalendarMonth, BarChart } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../utils/Contexts/useAuth";
// import { useLogout } from "../utils/api/useUserMutation";

// interface NavbarProps {
//   currentPage?: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
//   const navigate = useNavigate();
//   const { RoleId } = useAuth();
//   const isAdmin = RoleId === 1;
//   const { mutate: mutateExit } = useLogout();

//   return (
//     <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
//       <Toolbar>
//         <Hotel sx={{ mr: 2 }} />
//         <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
//           Hotel Booking
//         </Typography>

//         <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
//           {!isAdmin && (
//             <>
//               <Button
//                 color="inherit"
//                 onClick={() => navigate("/hotels")}
//                 sx={{
//                   backgroundColor:
//                     currentPage === "hotels"
//                       ? "rgba(255,255,255,0.2)"
//                       : "transparent",
//                 }}
//               >
//                 Готелі
//               </Button>
//               <Button
//                 color="inherit"
//                 startIcon={<CalendarMonth />}
//                 onClick={() => navigate("/my-bookings")}
//                 sx={{
//                   backgroundColor:
//                     currentPage === "bookings"
//                       ? "rgba(255,255,255,0.2)"
//                       : "transparent",
//                 }}
//               >
//                 Мої бронювання
//               </Button>
//             </>
//           )}

//           {isAdmin && (
//             <>
//               <Button
//                 color="inherit"
//                 startIcon={<Hotel />}
//                 onClick={() => navigate("/admin/hotels")}
//                 sx={{
//                   backgroundColor:
//                     currentPage === "admin-hotels"
//                       ? "rgba(255,255,255,0.2)"
//                       : "transparent",
//                 }}
//               >
//                 Готелі
//               </Button>
//               <Button
//                 color="inherit"
//                 onClick={() => navigate("/admin/rooms")}
//                 sx={{
//                   backgroundColor:
//                     currentPage === "admin-rooms"
//                       ? "rgba(255,255,255,0.2)"
//                       : "transparent",
//                 }}
//               >
//                 Номери
//               </Button>
//               <Button
//                 color="inherit"
//                 startIcon={<CalendarMonth />}
//                 onClick={() => navigate("/admin/bookings")}
//                 sx={{
//                   backgroundColor:
//                     currentPage === "admin-bookings"
//                       ? "rgba(255,255,255,0.2)"
//                       : "transparent",
//                 }}
//               >
//                 Бронювання
//               </Button>
//               <Button
//                 color="inherit"
//                 startIcon={<BarChart />}
//                 onClick={() => navigate("/admin/statistics")}
//                 sx={{
//                   backgroundColor:
//                     currentPage === "statistics"
//                       ? "rgba(255,255,255,0.2)"
//                       : "transparent",
//                 }}
//               >
//                 Статистика
//               </Button>
//             </>
//           )}
//         </Box>

//         <Button
//           color="inherit"
//           startIcon={<Logout />}
//           onClick={() =>
//             mutateExit(undefined, {
//               onSuccess: () => navigate("/login"),
//               onError: (error) => console.log("Error:", error),
//             })
//           }
//           sx={{ ml: 2 }}
//         >
//           Вийти
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Hotel,
  Logout,
  CalendarMonth,
  BarChart,
  Menu as MenuIcon, // Імпортуємо іконку гамбургера
  Key, // Нова іконка для Admin Rooms
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuth from "../utils/Contexts/useAuth";
import { useLogout } from "../utils/api/useUserMutation";

interface NavbarProps {
  currentPage?: string;
}

// Функція для генерації елементів меню
const getNavItems = (isAdmin: boolean) => {
  if (isAdmin) {
    return [
      {
        text: "Готелі (Адмін)",
        path: "/admin/hotels",
        icon: <Hotel />,
        page: "admin-hotels",
      },
      {
        text: "Номери",
        path: "/admin/rooms",
        icon: <Key />, // Використовуємо Key або іншу відповідну іконку
        page: "admin-rooms",
      },
      {
        text: "Бронювання",
        path: "/admin/bookings",
        icon: <CalendarMonth />,
        page: "admin-bookings",
      },
      {
        text: "Статистика",
        path: "/admin/statistics",
        icon: <BarChart />,
        page: "statistics",
      },
    ];
  } else {
    return [
      { text: "Готелі", path: "/hotels", icon: <Hotel />, page: "hotels" },
      {
        text: "Мої бронювання",
        path: "/my-bookings",
        icon: <CalendarMonth />,
        page: "bookings",
      },
    ];
  }
};

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const { RoleId } = useAuth();
  const isAdmin = RoleId === 1;
  const { mutate: mutateExit } = useLogout();

  // Стан для керування відкриттям/закриттям Drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = getNavItems(isAdmin);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    mutateExit(undefined, {
      onSuccess: () => navigate("/login"),
      onError: (error) => console.log("Error:", error),
    });
  };

  // Компонент Drawer (бічне меню) для мобільних пристроїв
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Hotel Booking
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor:
                  currentPage === item.page
                    ? "rgba(0,0,0,0.08)"
                    : "transparent",
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider />

        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Вийти" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Hotel sx={{ mr: 2, display: { xs: "none", sm: "block" } }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Hotel Booking
        </Typography>

        {/* 1. КНОПКА ГАМБУРГЕРА (Тільки для мобільних) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }} // Показуємо лише до md
        >
          <MenuIcon />
        </IconButton>

        {/* 2. НАВІГАЦІЙНІ КНОПКИ (Тільки для десктопу) */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{
                backgroundColor:
                  currentPage === item.page
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                whiteSpace: "nowrap", // Запобігаємо переносу тексту
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        {/* 3. КНОПКА ВИХОДУ */}
        <Box sx={{ ml: "auto" }}>
          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={handleLogout}
            // На мобільних пристроях показуємо лише іконку
            sx={{
              minWidth: { xs: "auto", md: 64 },
              p: { xs: 1, md: 0 },
            }}
          >
            <Box sx={{ display: { xs: "none", md: "block" } }}>Вийти</Box>
          </Button>
        </Box>
      </Toolbar>

      {/* 4. DRAWER (Висувне меню) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Для кращої продуктивності на мобільних
        }}
        sx={{
          display: { xs: "block", md: "none" }, // Показуємо лише до md
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;