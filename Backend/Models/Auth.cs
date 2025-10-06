using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class UserLoginRegister
    {
        [Required(ErrorMessage = "Email є обов’язковим")]
        [EmailAddress(ErrorMessage = "Невірний формат email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Пароль є обов’язковим")]
        [MinLength(6, ErrorMessage = "Пароль має містити щонайменше 6 символів")]
        public string Password { get; set; }
    }
}
