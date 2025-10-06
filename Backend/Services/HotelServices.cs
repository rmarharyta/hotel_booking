using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public interface IHotelService
    {
        Hotel? AddHotel(string Id, HotelRequest hotel);
        void DeleteHotel(string Id, string hotelId);
        IEnumerable<Hotel> GetAllHotels();
        void UpdateHotel(string Id, string hotelId, HotelRequest hotel);
        Hotel? GetHotelById(string hotelId);
    }
    public class HotelServices(ApplicationDbContext _context) : IHotelService
    {
        public Hotel? AddHotel(string Id, HotelRequest hotelRequest)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == Id);
            if (user?.RoleId == 2) throw new Exception("Немає доступу до данної дії");

            var hotel = new Hotel
            {
                Name= hotelRequest.Name,
                Address= hotelRequest.Address,
                Description= hotelRequest.Description,
                City= hotelRequest.City
            };
            _context.Hotels.Add(hotel);
            _context.SaveChanges();
            return hotel;
        }

        public void DeleteHotel(string Id, string hotelId)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == Id);
            if (user?.RoleId == 2) throw new Exception("Немає доступу до данної дії");

            var hotel = _context.Hotels.Find(hotelId);
            if (hotel != null)
            {
                _context.Hotels.Remove(hotel);
                _context.SaveChanges();
            }
        }

        public IEnumerable<Hotel> GetAllHotels()
        {
            return _context.Hotels.ToList();
        }

        public void UpdateHotel(string Id, string hotelId, HotelRequest hotel)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == Id);
            if (user?.RoleId == 2) throw new Exception("Немає доступу до данної дії");

            var existing = _context.Hotels.Find(hotelId);
            if (existing == null) return;

            existing.Name = hotel.Name;
            existing.City = hotel.City;
            existing.Address = hotel.Address;
            existing.Description = hotel.Description;
            _context.SaveChanges();
        }

        public Hotel? GetHotelById(string hotelId) => _context.Hotels.Find(hotelId);
    }
}
