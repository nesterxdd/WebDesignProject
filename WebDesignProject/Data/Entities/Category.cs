using System.ComponentModel.DataAnnotations;
using WebDesignProject.Data;

public class Category
{
    public Category()
    {
        ResourceCategories = new HashSet<ResourceCategory>();
    }

    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)] 
    public string Name { get; set; }

    public ICollection<ResourceCategory> ResourceCategories { get; set; }
}