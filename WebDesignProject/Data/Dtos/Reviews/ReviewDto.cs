namespace WebDesignProject
{
    public record ReviewDto(
        int Id,
        string Comment,
        int Rating,
        int ResourceId,
        int UserId,
        DateTime CreatedAt, // Add CreatedAt
        DateTime? UpdatedAt // Add UpdatedAt (nullable for cases where it hasn't been updated)
    );
}
