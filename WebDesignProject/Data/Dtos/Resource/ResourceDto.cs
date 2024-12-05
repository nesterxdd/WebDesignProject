using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace WebDesignProject
{
    public class ResourceDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public ICollection<ReviewDto>? Reviews { get; set; } // Optional: Dto for reviews
        public ICollection<CategoryDto>? Categories { get; set; } // Optional: Dto for categories

        [JsonProperty("createdAt")] // Serialize as "createdAt"
        public DateTime CreatedAt { get; set; } // Include CreatedAt

        // Parameterless constructor
        public ResourceDto()
        {
        }
    }
}
