using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    //Interface for services
    public interface IUserService
    {
        User? Registration(UserLoginRegister userRegister);
        User? LogIn(UserLoginRegister userLogin);
        User? GetById(string userId);
    }
    public class UserServices(ApplicationDbContext _context) : IUserService
    {
        public User? Registration(UserLoginRegister userRegister)
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
                RoleId=2,

            };
            _context.Set<User>().Add(user);
            _context.SaveChanges();
            return user;
        }

        public User? LogIn(UserLoginRegister userLogin)
        {
            var login = _context.Set<User>().FirstOrDefault(u => u.Email == userLogin.Email);
            if (login == null)
            {
                return null;
            }
            if (BCrypt.Net.BCrypt.EnhancedVerify(userLogin.Password, login.PasswordHash))
            {
                return login;
            }
            return null;
        }

        public User? GetById(string userId)
        {
            var user =_context.Set<User>().FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return null;
            }
            Console.WriteLine(userId);
            Console.WriteLine(user.RoleId);
            return user;
        }

    }
}
