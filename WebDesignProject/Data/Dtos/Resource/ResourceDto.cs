using WebDesignProject.Data;

namespace WebDesignProject
{
    public record ResourceDto(int Id, string Title, string Description, ICollection<Review> Reviews, ICollection<ResourceCategory> ResourceCategories);

}
