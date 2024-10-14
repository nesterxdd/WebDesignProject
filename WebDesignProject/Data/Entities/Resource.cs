namespace WebDesignProject.Data
{
    public class Resource
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string Metadata { get; set; }
        public string Status { get; set; }

        // Navigation properties
        public ICollection<Review> Reviews { get; set; }
        public ICollection<ResourceCategory> ResourceCategories { get; set; }
    }

}
