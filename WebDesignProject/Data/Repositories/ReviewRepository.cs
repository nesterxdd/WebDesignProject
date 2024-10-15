using Microsoft.EntityFrameworkCore;

namespace WebDesignProject.Data.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly MyContext _mycontext;

        public ReviewRepository(MyContext myContext)
        {
            _mycontext = myContext;
        }

        public async Task<Review> GetAsync(int resourceId, int reviewId)
        {
            return await _mycontext.Reviews.FirstOrDefaultAsync(r => r.ResourceId == resourceId && r.Id == reviewId);
        }

        public async Task<IEnumerable<Review>> GetAsync(int resourceId)
        {
            return await _mycontext.Reviews.Where(r => r.ResourceId == resourceId).ToListAsync();
        }

        public async Task InsertAsync(Review review)
        {
            _mycontext.Reviews.Add(review);
            await _mycontext.SaveChangesAsync();   
        }

        public async Task UpdateAsync(Review review)
        {
            _mycontext.Reviews.Update(review);
            await _mycontext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Review review)
        {
            _mycontext.Reviews.Remove(review);
            await _mycontext.SaveChangesAsync();
        }
    }
}
