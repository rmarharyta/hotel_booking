using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public interface IRoomService
    {
        Room? AddRoom(string Id, string hotelId, RoomRequest roomRequest);
        void DeleteRoom(string Id, string roomId);
        IEnumerable<Room> GetAllRooms();
        IEnumerable<Room> GetAllHotelsRooms(string hotelId);
        void UpdateRoom(string Id, string roomId, RoomRequest room);
        Room? GetRoomById(string roomId);
    }
    public class RoomServices(ApplicationDbContext _context) : IRoomService
    {
        public Room? AddRoom(string Id,string hotelId, RoomRequest roomRequest)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == Id);
            if (user?.RoleId == 2) throw new Exception("Немає доступу до данної дії");

            var room = new Room
            {
                HotelId = hotelId,
                RoomNumber = roomRequest.RoomNumber,
                Capacity = roomRequest.Capacity,
                PricePerNight = roomRequest.PricePerNight
            };
            _context.Rooms.Add(room);
            _context.SaveChanges();
            return room;
        }

        public void DeleteRoom(string Id, string roomId)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == Id);
            if (user?.RoleId == 2) throw new Exception("Немає доступу до данної дії");

            var room = _context.Rooms.Find(roomId);
            if (room != null)
            {
                _context.Rooms.Remove(room);
                _context.SaveChanges();
            }
        }

        public IEnumerable<Room> GetAllRooms()
        {
            return _context.Rooms.ToList();
        }
        public IEnumerable<Room> GetAllHotelsRooms(string hotelId)
        {
            return _context.Rooms.Where(u=>u.HotelId == hotelId).ToList();
        }
        public void UpdateRoom(string Id, string roomId, RoomRequest room)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == Id);
            if (user?.RoleId == 2) throw new Exception("Немає доступу до данної дії");

            var existing = _context.Rooms.Find(roomId);
            if (existing == null) return;

            existing.Capacity=room.Capacity;
            existing.PricePerNight=room.PricePerNight;
            existing.RoomNumber=room.RoomNumber;

            _context.SaveChanges();
        }

        public Room? GetRoomById(string roomId) => _context.Rooms.Find(roomId);
    }
}