
namespace WebDesignProject.Data
{
    public interface IResourceRepository
    {
        Task DeleteAsync(Resource resource);
        Task<Resource> GetAsync(int id);
        Task<IEnumerable<Resource>> GetAsync();
        Task<Resource> InsertAsync(Resource resource, ICollection<int> categoryIds);
        Task<Resource> UpdateAsync(Resource resource, ICollection<int> categoryIds);
    }
}