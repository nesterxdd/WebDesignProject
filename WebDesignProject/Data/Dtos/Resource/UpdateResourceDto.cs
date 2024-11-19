using System.ComponentModel.DataAnnotations;
namespace WebDesignProject
{
    public record UpdateResourceDto([Required] string Title, ICollection<int>? categoriesIDs);
}
