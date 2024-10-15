using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public record UpdateUserDto([Required] string Name, [Required] string Email, [Required] string Role);

}
