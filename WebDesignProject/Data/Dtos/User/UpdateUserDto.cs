using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public class UpdateUserDto
    {
        public string Name { get; set; } // Allow name update
        public string Email { get; set; } // Allow email update

        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string? CurrentPassword { get; set; } // For verifying the current password

        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string? Password { get; set; }

        public string? Role { get; set; } // Optional role update
    }
}
