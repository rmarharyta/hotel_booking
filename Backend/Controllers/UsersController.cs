using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore.Query.Internal;

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
                var returnedUser = _userServices.Registration(userRegister);
                var user = new User
                {
                    Id = returnedUser.Id,
                    RoleId= returnedUser.RoleId
                };
                var tokenExpiration = DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration);

                string token = jwtService.GenerateToken(user, tokenExpiration);
                string refreshToken = encryptionService.Encrypt(encryptionService.SecretKeys.RefreshTokenEncryptionSecretKey, returnedUser.Id);

                authenticationService.SetAuthCookies(HttpContext, token, refreshToken);

                return CreatedAtAction(nameof(RegistrationUser), new { returnedUser.Id,returnedUser.RoleId });
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
                var returnedUser = _userServices.LogIn(userLogin)
                    ?? throw new Exception("Login is failed");

                var user = new User
                {
                    Id = returnedUser.Id,
                    RoleId = returnedUser.RoleId
                };

                var tokenExpiration = DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration);

                string token = jwtService.GenerateToken(user, tokenExpiration);
                string refreshToken = encryptionService.Encrypt(encryptionService.SecretKeys.RefreshTokenEncryptionSecretKey, returnedUser.Id);

                authenticationService.SetAuthCookies(HttpContext, token, refreshToken);

                return Ok(new { returnedUser.Id, returnedUser.RoleId });
            }
            catch (Exception ex)
            {
                return BadRequest("Problem: " + ex.Message);
            }
        }

        //logout
        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {
            authenticationService.RemoveAuthCookies(HttpContext);
            return Ok();
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
                var returnedUser =  _userServices.GetById(userId);
                if (returnedUser == null)
                    return Unauthorized();
                var user = new User
                {
                    Id = returnedUser.Id,
                    RoleId = returnedUser.RoleId
                };
                var token = jwtService.GenerateToken(user, DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration));
                authenticationService.SetAuthCookies(HttpContext, token, refreshToken);
                return Ok(new { returnedUser.Id, returnedUser.RoleId });
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
            var returnedUser = _userServices.GetById(user.Value.Id);
            if (returnedUser == null) return Unauthorized();

            if (!user.IsError)
                return Ok(new { user.Value.Id, returnedUser.RoleId });
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
