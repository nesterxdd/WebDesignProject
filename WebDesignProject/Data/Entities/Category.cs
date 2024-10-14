namespace WebDesignProject.Data
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Navigation properties
        public ICollection<ResourceCategory> ResourceCategories { get; set; }
    }

}
