using WebDesignProject.Data;

namespace WebDesignProject
{
    public class ResourceDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<ResourceCategory> ResourceCategories { get; set; }

        public ResourceDto() { }
    }
}
