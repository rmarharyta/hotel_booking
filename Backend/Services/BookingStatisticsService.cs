using Backend.Data;
using Backend.Models;
using Dapper;
using MySql.Data.MySqlClient;

namespace Backend.Services
{
    public interface IBookingStatisticsService
    {
        Task<IEnumerable<BookingStatisticsDto>>? GetHotelBookingStatisticsAsync(string userId, string hotelId, DateTime startDate, DateTime endDate);
    }

    public class BookingStatisticsService(ApplicationDbContext _context, IConfiguration _configuration) : IBookingStatisticsService
    {
        public async Task<IEnumerable<BookingStatisticsDto>>? GetHotelBookingStatisticsAsync(string userId, string hotelId, DateTime startDate, DateTime endDate)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) throw new Exception("Користувач не знайден");
            if (user.RoleId == 2) throw new Exception("Немає доступу до данної дії");

            using var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();

            string sql = @"
                SELECT 
                    h.Name AS HotelName,
                    COUNT(b.Id) AS TotalBookings,
                    SUM(b.TotalPrice) AS TotalRevenue,
                    MIN(b.CheckInDate) AS FirstBooking,
                    MAX(b.CheckOutDate) AS LastBooking
                FROM Bookings b
                INNER JOIN Rooms r ON b.RoomId = r.Id
                INNER JOIN Hotels h ON r.HotelId = h.Id
                WHERE r.HotelId = @HotelId
                  AND b.CheckInDate >= @StartDate
                  AND b.CheckOutDate <= @EndDate
                GROUP BY h.Name;
            ";

            var result = await connection.QueryAsync<BookingStatisticsDto>(
                sql,
                new { HotelId = hotelId, StartDate = startDate, EndDate = endDate }
            );
            connection.Close();

            return result;
        }
    }
}
