using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    
    public record CreateResourceDto([Required] string Title, [Required] string Description, [Required] string Metadata, [Required] string Status, [Required] string Type);
   
}
