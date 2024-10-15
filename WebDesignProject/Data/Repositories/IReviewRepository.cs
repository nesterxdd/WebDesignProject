
namespace WebDesignProject.Data.Repositories
{
    public interface IReviewRepository
    {
        Task DeleteAsync(Review review);
        Task<List<Review>> GetAsync(int reviewId);
        Task<Review> GetAsync(int resourceId, int reviewId);
        Task InsertAsync(Review review);
        Task UpdateAsync(Review review);
    }
}