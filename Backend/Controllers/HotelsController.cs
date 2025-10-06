using Backend.Models;
using Backend.Services;
using ErrorOr;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelsController(IHotelService _hotelService, IUserClaimsMapper<User> userClaimsMapper) : Controller
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
        public IActionResult AddHotel([FromBody] HotelRequest hotel)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);

            if (hotel == null) return BadRequest("Інформація про готель необхідна!");
            try
            {
                return Ok(_hotelService.AddHotel(currentUserId.Value, hotel));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetHotels()
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);
            try
            {
                return Ok(_hotelService.GetAllHotels());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateHotel([FromRoute] string id, [FromBody] HotelRequest hotel)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);

            if (id == null || hotel == null) return BadRequest("Missing data");
            try
            {
                _hotelService.UpdateHotel(currentUserId.Value, id, hotel);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteHotel([FromRoute] string id)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);

            if (id == null) return BadRequest("No hotel id provided");
            try
            {
                _hotelService.DeleteHotel(currentUserId.Value, id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
