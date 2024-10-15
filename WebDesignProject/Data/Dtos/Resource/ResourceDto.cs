using WebDesignProject.Data;
using WebDesignProject.Data.Dtos.Reviews;

namespace WebDesignProject
{
    public record ResourceDto(int Id, string Title, string Description, ICollection<ReviewDto> Reviews, ICollection<ResourceCategory> ResourceCategories);

}
