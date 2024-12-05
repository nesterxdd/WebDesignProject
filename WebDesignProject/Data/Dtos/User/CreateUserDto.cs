using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public class CreateUserDto
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string PasswordHash { get; set; } // Rename if necessary to 'Password'

        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; }
    }
}
