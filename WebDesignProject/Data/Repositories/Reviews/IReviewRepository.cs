namespace WebDesignProject.Data.Repositories.Reviews
{
    public interface IReviewRepository
    {
        Task DeleteAsync(Review review);
        Task<IEnumerable<Review>> GetAsync(int resourceId);

        Task InsertAsync(Review review);
        Task UpdateAsync(Review review);

        Task<IEnumerable<Review>> GetReviewsByUserAsync(int userId);

        Task<Review> GetByIdAsync(int reviewId);
        Task<string> GetUserNameByIdAsync(int userId);
    }
}