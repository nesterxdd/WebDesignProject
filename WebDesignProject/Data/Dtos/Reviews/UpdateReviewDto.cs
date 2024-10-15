using System.ComponentModel.DataAnnotations;

namespace WebDesignProject
{
    public record UpdateReviewDto([Required] string Comment, [Required] int Rating);
}
