
namespace WebDesignProject.Data
{
    public interface IResourceRepository
    {
        Task<Resource> Create(Resource resource);
        Task Delete();
        Task<Resource> Get(int id);
        Task<IEnumerable<Resource>> GetAll();
        Task<Resource> Put();
    }
}