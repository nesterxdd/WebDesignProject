using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebDesignProject.Data.Repositories
{
    public class ResourceRepository : IResourceRepository
    {
        private readonly MyContext _mycontext;

        public ResourceRepository(MyContext mycontext)
        {
            _mycontext = mycontext;
        }

        public async Task<IEnumerable<Resource>> GetAsync()
        {
            return await _mycontext.Resources
                .Include(r => r.Reviews) // Include reviews for all resources
                .ToListAsync();
        }

        public async Task<Resource> GetAsync(int id)
        {
            return await _mycontext.Resources
            .Include(r => r.Reviews) 
            .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Resource> InsertAsync(Resource resource)
        {
            _mycontext.Resources.Add(resource);
            await _mycontext.SaveChangesAsync();
            return resource;
        }

        public async Task DeleteAsync(Resource resource)
        {
            _mycontext.Resources.Remove(resource);
            await _mycontext.SaveChangesAsync();
        }

        public async Task<Resource> UpdateAsync(Resource resource)
        {
            _mycontext.Resources.Update(resource);
            await _mycontext.SaveChangesAsync();
            return resource;
        }
    }
}
