using Backend.Models;
using Backend.Services;
using ErrorOr;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingStatisticsController(IBookingStatisticsService _statisticsService, IUserClaimsMapper<User> userClaimsMapper) : ControllerBase
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


        [HttpGet("Hotel")]
        public async Task<IActionResult> GetHotelStatistics(
            [FromQuery] string hotelId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);

            if (string.IsNullOrEmpty(hotelId))
                return BadRequest("Не вказано ідентифікатор готелю.");

            if (startDate > endDate)
                return BadRequest("Дата початку не може бути пізніше дати завершення.");
            try
            {
                var data = await _statisticsService.GetHotelBookingStatisticsAsync(currentUserId.Value, hotelId, startDate, endDate);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
