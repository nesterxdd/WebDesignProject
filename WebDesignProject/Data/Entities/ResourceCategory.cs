namespace WebDesignProject.Data
{
    public class ResourceCategory
    {
        public int ResourceId { get; set; }
        public Resource Resource { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }

}
