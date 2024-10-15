﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using WebDesignProject.Data;

namespace WebDesignProject
{
    
    public record CreateResourceDto([Required] string Title, [Required] string Description, [Required] string Metadata, [Required] string Status, [Required] string Type, ICollection<int> categoriesIDs);
   
}
