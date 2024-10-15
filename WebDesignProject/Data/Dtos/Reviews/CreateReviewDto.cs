using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public record CreateReviewDto([Required] int userId, [Required] string comment, [Required] int rating);
}
