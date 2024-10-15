using System.ComponentModel.DataAnnotations;

namespace WebDesignProject.Data.Dtos.Reviews
{
    public record CreateReviewDto([Required] string userId, [Required] string comment, [Required] int rating, [Required] int resourceId);
}
