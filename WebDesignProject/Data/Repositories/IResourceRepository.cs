
namespace WebDesignProject.Data
{
    public interface IResourceRepository
    {
        Task<Resource> Create(Resource resource);
        Task Delete(Resource resource);
        Task<Resource> Get(int id);
        Task<IEnumerable<Resource>> GetAll();
        Task<Resource> Put(Resource resource);
    }
}