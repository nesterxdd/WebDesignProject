using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public class Category
    {
        public Category()
        {
            Resources = new HashSet<Resource>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public ICollection<Resource> Resources { get; set; }
    }
}
