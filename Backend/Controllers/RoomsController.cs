using Backend.Models;
using Backend.Services;
using ErrorOr;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController(IRoomService _roomService, IUserClaimsMapper<User> userClaimsMapper) : Controller
    {
        private ErrorOr<string> GetUserIdFromToken()
        {
            var token = HttpContext.Request.Cookies[CookieKeys.Token];
            if (string.IsNullOrEmpty(token))
                return Error.Unauthorized("Token not found");

            var user = userClaimsMapper.FromClaims(token);
            if (string.IsNullOrEmpty(user.Id))
                return Error.Unauthorized("User ID claim not found");

            return user.Id;
        }

        [HttpPost("{id}")]
        public IActionResult AddRoom([FromRoute] string hotelId,[FromBody] RoomRequest room)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);

            if (room == null) return BadRequest("Інформація про готель необхідна!");
            try
            {
                return Ok(_roomService.AddRoom(currentUserId.Value, hotelId, room));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get_all")]
        public IActionResult GetRooms()
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);
            try
            {
                return Ok(_roomService.GetAllRooms());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get_by_hotels")]
        public IActionResult GetHotelsRooms(string hotelId)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);
            try
            {
                return Ok(_roomService.GetAllHotelsRooms(hotelId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRoom([FromRoute] string id, [FromBody] RoomRequest room)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);

            if (id == null || room == null) return BadRequest("Missing data");
            try
            {
                _roomService.UpdateRoom(currentUserId.Value, id, room);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRoom([FromRoute] string id)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);

            if (id == null) return BadRequest("No hotel id provided");
            try
            {
                _roomService.DeleteRoom(currentUserId.Value, id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
