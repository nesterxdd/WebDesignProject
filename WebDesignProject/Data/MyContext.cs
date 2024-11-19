﻿using Microsoft.EntityFrameworkCore;

namespace WebDesignProject
{
    public class MyContext : DbContext
    {

        public MyContext(DbContextOptions<MyContext> options) : base(options)
        {
        }

        public DbSet<Resource> Resources { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Review> Reviews { get; set; }

        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=DESKTOP-HQEF13N\\SQLEXPRESS;Database=WebDesignProject;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;");
        }
    }
}
