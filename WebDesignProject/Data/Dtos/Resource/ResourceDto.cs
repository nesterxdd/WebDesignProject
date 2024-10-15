using WebDesignProject.Data;

namespace WebDesignProject
{
    public class ResourceDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<ReviewDto> Reviews { get; set; } // If you're using Dto for reviews
        public ICollection<CategoryDto> Categories { get; set; } // If you're using Dto for categories

        // Parameterless constructor
        public ResourceDto()
        {

        }
    }
}

