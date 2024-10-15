using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    
    public record CreateResourceDto([Required] string Title, [Required] string Description);
   
}
