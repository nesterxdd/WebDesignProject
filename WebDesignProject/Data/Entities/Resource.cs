using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebDesignProject.Data
{
    public class Resource
    {
        public Resource()
        {
            Reviews = new HashSet<Review>();
            ResourceCategories = new HashSet<ResourceCategory>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)] 
        public string Title { get; set; }

        [Required]
        [StringLength(50)] 
        public string Type { get; set; }

        public string Description { get; set; }

        public string Metadata { get; set; }

        [Required]
        [StringLength(20)] 
        public string Status { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public ICollection<Review> Reviews { get; set; }
        public ICollection<ResourceCategory> ResourceCategories { get; set; }
    }
}
