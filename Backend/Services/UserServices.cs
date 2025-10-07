using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    //Interface for services
    public interface IUserService
    {
        User Registration(UserLoginRegister userRegister);
        User LogIn(UserLoginRegister userLogin);
        User GetById(string userId);
    }
    public class UserServices(ApplicationDbContext _context) : IUserService
    {
        public User Registration(UserLoginRegister userRegister)
        {
            if (_context.Users.Any(u=>u.Email== userRegister.Email))
            {
                throw new Exception("Цей користувач вже зареєстрований");
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

        public User LogIn(UserLoginRegister userLogin)
        {
            var login = _context.Set<User>().FirstOrDefault(u => u.Email == userLogin.Email);
            if (login == null)
            {
                throw new Exception("Даний користувач не зареєстрований");
            }
            if (BCrypt.Net.BCrypt.EnhancedVerify(userLogin.Password, login.PasswordHash))
            {
                return login;
            }
            throw new Exception("Паролі не співпали");
        }

        public User GetById(string userId)
        {
            var user =_context.Set<User>().FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                throw new Exception("Користувач не знайден");
            }
            Console.WriteLine(userId);
            Console.WriteLine(user.RoleId);
            return user;
        }

    }
}
