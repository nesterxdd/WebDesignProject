using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{ 
    public record CreateUserDto([Required] string Name, [Required] string Email, [Required] string PasswordHash, [Required] string Role);
}
