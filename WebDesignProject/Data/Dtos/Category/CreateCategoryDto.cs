using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public record CreateCategoryDto([Required] string Name);
}
