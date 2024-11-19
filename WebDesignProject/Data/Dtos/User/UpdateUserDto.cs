using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public class UpdateUserDto
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? Role { get; set; }  
                                          
    }


}
