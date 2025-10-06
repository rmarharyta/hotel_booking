using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController(IUserService _userServices, IEncryptionService encryptionService, Services.IAuthenticationService authenticationService, IJwtService jwtService, IUserClaimsMapper<User> userClaimsMapper) : ControllerBase
    {
        //Register
        [HttpPost]
        [Route("registration")]
        public IActionResult RegistrationUser([FromBody] UserLoginRegister userRegister)
        {
            if (userRegister == null)
            {
                return BadRequest("User data is required.");
            }
            try
            {
                var returnedUserId = _userServices.Registration(userRegister);
                var user = new User
                {
                    Id = returnedUserId
                };
                var tokenExpiration = DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration);

                string token = jwtService.GenerateToken(user, tokenExpiration);
                string refreshToken = encryptionService.Encrypt(encryptionService.SecretKeys.RefreshTokenEncryptionSecretKey, returnedUserId);

                authenticationService.SetAuthCookies(HttpContext, token, refreshToken);

                return CreatedAtAction(nameof(RegistrationUser), new { returnedUserId });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + "Something went wrong.");
            }
        }

        //log in
        [HttpPost]
        [Route("login")]
        public IActionResult LogInUsers([FromBody] UserLoginRegister userLogin)
        {
            Console.WriteLine("Login");
            if (userLogin == null)
                return BadRequest("User data is required.");

            try
            {
                var returnedUserId = _userServices.LogIn(userLogin)
                    ?? throw new Exception("Login is failed");

                var user = new User
                {
                    Id = returnedUserId
                };
                var tokenExpiration = DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration);

                string token = jwtService.GenerateToken(user, tokenExpiration);
                string refreshToken = encryptionService.Encrypt(encryptionService.SecretKeys.RefreshTokenEncryptionSecretKey, returnedUserId);

                authenticationService.SetAuthCookies(HttpContext, token, refreshToken);

                return Ok(new { returnedUserId });
            }
            catch (Exception ex)
            {
                return BadRequest("Problem: " + ex.Message);
            }
        }

        //logout
        [HttpGet]
        [Route("logout")]
        public IActionResult Logout()
        {
            authenticationService.RemoveAuthCookies(HttpContext);
            return Ok();
        }

        //delete
        [HttpDelete]
        [Authorize]
        public IActionResult DeleteUsers()
        {
            var currentUser = GetUserFromToken();
            if (currentUser.IsError)
                return Unauthorized(currentUser.FirstError.Code);

            try
            {
                _userServices.DeleteUser(currentUser.Value.Id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Could not delete {ex.Message}");
            }
        }

        [HttpGet]
        [Route("refresh")]
        public IActionResult RefreshToken()
        {
            string? refreshToken = HttpContext.Request.Cookies[CookieKeys.RefreshToken];
            if (refreshToken is null)
                return Unauthorized();

            string userId = encryptionService.Decrypt(encryptionService.SecretKeys.RefreshTokenEncryptionSecretKey, refreshToken);
            if (userId == null)
                return Unauthorized();

            try
            {
                var user = new User { Id = userId };
                var token = jwtService.GenerateToken(user, DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration));
                authenticationService.SetAuthCookies(HttpContext, token, refreshToken);
                return Ok();
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        [Route("me")]
        public IActionResult GetUser()
        {
            var user = GetUserFromToken();
            if (!user.IsError)
                return Ok(new { user.Value.Id });
            return BadRequest(new { Error = user.FirstError.Code });
        }

        private ErrorOr<User> GetUserFromToken()
        {
            var token = HttpContext.Request.Cookies[CookieKeys.Token];
            if (string.IsNullOrEmpty(token))
                return Error.Unauthorized("Token not found");

            var user = userClaimsMapper.FromClaims(token);
            if (user is not null)
                return user;

            return Error.Unauthorized("User ID claim not found");
        }
    }
}
