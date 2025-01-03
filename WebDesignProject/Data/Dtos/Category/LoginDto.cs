﻿using System.ComponentModel.DataAnnotations;

namespace WebDesignProject.Data.Dtos.Category
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

}
