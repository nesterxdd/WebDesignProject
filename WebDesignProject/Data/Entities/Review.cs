﻿namespace WebDesignProject.Data
{
    public class Review
    {
        public int Id { get; set; }
        public int ResourceId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Resource Resource { get; set; }
        public User User { get; set; }
    }

}
