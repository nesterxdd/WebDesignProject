using System.ComponentModel.DataAnnotations;

namespace WebDesignProject.Data.Dtos.Reviews
{
    public record UpdateReviewDto([Required] string Comment, [Required] int Rating);
}
