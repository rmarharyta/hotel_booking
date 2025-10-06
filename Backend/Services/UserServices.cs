using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    //Interface for services
    public interface IUserService
    {
        string? Registration(UserLoginRegister userRegister);
        void DeleteUser(string userId);
        string? LogIn(UserLoginRegister userLogin);
    }
    public class UserServices(ApplicationDbContext _context) : IUserService
    {
        public string? Registration(UserLoginRegister userRegister)
        {
            if (_context.Users.Any(u=>u.Email== userRegister.Email))
            {
                return null;
            }
            var password = BCrypt.Net.BCrypt.EnhancedHashPassword(userRegister.Password);
            User user = new User
            {
                Email = userRegister.Email,
                PasswordHash = password,
                RoleId=1,

            };
            _context.Set<User>().Add(user);
            _context.SaveChanges();
            return user.Id;
        }

        public string? LogIn(UserLoginRegister userLogin)
        {
            var login = _context.Set<User>().FirstOrDefault(u => u.Email == userLogin.Email);
            if (login == null)
            {
                return null;
            }
            if (BCrypt.Net.BCrypt.EnhancedVerify(userLogin.Password, login.PasswordHash))
            {
                return login.Id;
            }
            return null;
        }

        public void DeleteUser(string userId)
        {
            var user = _context.Set<User>().FirstOrDefault(u => u.Id == userId);

            if (user != null)
            {
                _context.Set<User>().Remove(user);

                _context.SaveChanges();
            }
        }
    }
}
