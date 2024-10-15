namespace WebDesignProject.Data.Dtos.Reviews
{
    public record ReviewDto(int Id, string comment, int Rating, int ResourceId, int UserId);

}
