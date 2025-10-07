using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface IBookingService
    {
        Booking AddBooking(string userId, BookingRequest bookingRequest);
        void DeleteBooking(string bookingId, string userId);
        IEnumerable<Booking> GetUserBookings(string userId);
        IEnumerable<Booking>? GetHotelBookings(string userId, string hotelId);
        IEnumerable<Booking> GetRoomBookings(string roomId);
        IEnumerable<Booking>? GetAllBookings(string userId);
    }

    public class BookingServices(ApplicationDbContext _context) : IBookingService
    {
        public Booking AddBooking(string userId, BookingRequest bookingRequest)
        {
            var room = _context.Rooms.Find(bookingRequest.RoomId);

            var nights = (bookingRequest.CheckOutDate - bookingRequest.CheckInDate).Days;
            bookingRequest.TotalPrice = room.PricePerNight * nights;

            var booking = new Booking
            {
                UserId = userId,
                RoomId = bookingRequest.RoomId,
                CheckInDate = bookingRequest.CheckInDate,
                CheckOutDate = bookingRequest.CheckOutDate,
                TotalPrice = bookingRequest.TotalPrice,
            };

            _context.Bookings.Add(booking);
            _context.SaveChanges();
            return booking;
        }

        public void DeleteBooking(string bookingId, string userId)
        {
            var booking = _context.Bookings.Find(bookingId);
            if (booking == null) return;

            var user = _context.Users.Find(userId);
            if (booking.UserId == userId || user?.RoleId == 1)
            {
                _context.Bookings.Remove(booking);
                _context.SaveChanges();
            }
        }

        public IEnumerable<Booking> GetUserBookings(string userId)
        {
            return _context.Bookings
                .Where(b => b.UserId == userId)
                .ToList();
        }

        public IEnumerable<Booking>? GetHotelBookings(string userId, string hotelId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) throw new Exception("Користувача не знайден");
            if (user.RoleId == 2) throw new Exception("Немає доступу до данної дії");

            return _context.Bookings
                .Include(b => b.RoomId)
                .Where(b => _context.Rooms.Any(r => r.Id == b.RoomId && r.HotelId == hotelId))
                .ToList();
        }

        public IEnumerable<Booking> GetRoomBookings(string roomId)
        {
            return _context.Bookings
                .Where(b => b.RoomId == roomId)
                .ToList();
        }

        public IEnumerable<Booking>? GetAllBookings(string userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) throw new Exception("Користувач не знайден");
            if (user.RoleId == 2) throw new Exception("Немає доступу до данної дії");

            return _context.Bookings.ToList();
        }
    }
}
