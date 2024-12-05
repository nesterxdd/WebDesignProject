public record ReviewDto(
    int Id,
    string Comment,
    int Rating,
    int ResourceId,
    int UserId,
    string UserName,  // Add UserName field
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
