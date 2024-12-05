using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public class Resource
    {
        public Resource()
        {
            Reviews = new HashSet<Review>();
            Categories = new HashSet<Category>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        public string Title { get; set; }

        [Required]
        [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters.")]
        public string Description { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<Category> Categories { get; set; }

        [Required]
        [System.Text.Json.Serialization.JsonConverter(typeof(IsoDateTimeConverter))]  // Ensure it's in ISO 8601 format
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; }
    }
}
