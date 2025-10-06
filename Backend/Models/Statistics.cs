using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class BookingStatisticsDto
    {
        public string HotelName { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public DateTime? FirstBooking { get; set; }
        public DateTime? LastBooking { get; set; }
    }
}
