using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public record CreateReviewDto(
        [Required] int UserId,
        [Required] string Comment,
        [Required, Range(1, 5)] int Rating,
        [Required] int ResourceId // The resource being reviewed
    );
}
