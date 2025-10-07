using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class HotelRequest
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string? Description { get; set; }
    }
    public class RoomRequest
    {
        [Required]
        public string RoomNumber { get; set; }
        [Required]
        public int Capacity { get; set; }
        [Required]
        public decimal PricePerNight { get; set; }
    }
    public class BookingRequest
    {
        [Required]
        public string? RoomId { get; set; }
        [Required]
        public string? HotelName { get; set; }
        [Required]
        public DateTime CheckInDate { get; set; }
        [Required]
        public DateTime CheckOutDate { get; set; }
        [Required]
        public decimal TotalPrice { get; set; }
    }

}
