using Backend.Models;
using Backend.Services;
using ErrorOr;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController(IBookingService _bookingService, IUserClaimsMapper<User> userClaimsMapper) : ControllerBase
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

        [HttpPost]
        public IActionResult AddBooking([FromBody] BookingRequest booking)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);

            try
            {
                return Ok(_bookingService.AddBooking(currentUserId.Value, booking));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBooking([FromRoute] string id)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError) return Unauthorized(currentUserId.FirstError.Code);

            try
            {
                _bookingService.DeleteBooking(id, currentUserId.Value);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("user_booking")]
        public IActionResult GetUserBookings()
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError) return Unauthorized(currentUserId.FirstError.Code);

            return Ok(_bookingService.GetUserBookings(currentUserId.Value));
        }

        [HttpGet("room/{roomId}")]
        public IActionResult GetRoomBookings([FromRoute] string roomId)
        {
            return Ok(_bookingService.GetRoomBookings(roomId));
        }

        [HttpGet("all")]
        public IActionResult GetAllBookings()
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError) return Unauthorized(currentUserId.FirstError.Code);

            return Ok(_bookingService.GetAllBookings(currentUserId.Value));
        }
    }
}
