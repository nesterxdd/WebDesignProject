
namespace WebDesignProject.Data.Repositories
{
    public interface IReviewRepository
    {
        Task DeleteAsync(Review review);
        Task<IEnumerable<Review>> GetAsync(int resourceId);
        Task<Review> GetAsync(int resourceId, int reviewId);
        Task InsertAsync(Review review);
        Task UpdateAsync(Review review);
    }
}