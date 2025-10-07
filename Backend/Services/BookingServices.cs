using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public interface IBookingService
    {
        Booking AddBooking(string userId, BookingRequest bookingRequest);
        void DeleteBooking(string bookingId, string userId);
        ICollection<Booking> GetUserBookings(string userId);
        ICollection<Booking> GetRoomBookings(string roomId);
        ICollection<Booking> GetAllBookings(string userId);
    }

    public class BookingServices(ApplicationDbContext _context) : IBookingService
    {
        public Booking AddBooking(string userId, BookingRequest bookingRequest)
        {
            bool isRoomBooked = _context.Bookings.Any(b =>
                b.RoomId == bookingRequest.RoomId && 
                b.CheckInDate < bookingRequest.CheckOutDate && 
                b.CheckOutDate > bookingRequest.CheckInDate 
            );

            if (isRoomBooked)
            {
                throw new InvalidOperationException("Ця кімната вже заброньована на вибрані дати.");
            }

            var booking = new Booking
            {
                UserId = userId,
                RoomId = bookingRequest.RoomId,
                HotelName = bookingRequest.HotelName,
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

        public ICollection<Booking> GetUserBookings(string userId)
        {
            return _context.Bookings
                .Where(b => b.UserId == userId)
                .ToList();
        }

        public ICollection<Booking> GetRoomBookings(string roomId)
        {
            return _context.Bookings
                .Where(b => b.RoomId == roomId)
                .ToList();
        }

        public ICollection<Booking> GetAllBookings(string userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) throw new Exception("Користувач не знайден");
            if (user.RoleId != 1) throw new Exception("Немає доступу до данної дії");

            return _context.Bookings.ToList();
        }
    }
}
