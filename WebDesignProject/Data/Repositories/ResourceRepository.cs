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

        public async Task<IEnumerable<Resource>> GetAll()
        {
            return await _mycontext.Resources.ToListAsync();
        }

        public async Task<Resource> Get(int id)
        {
            return await _mycontext.Resources.FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Resource> Create(Resource resource)
        {
            _mycontext.Resources.Add(resource);
            await _mycontext.SaveChangesAsync();
            return resource;
        }

        public async Task Delete(Resource resource)
        {
            _mycontext.Resources.Remove(resource);
            await _mycontext.SaveChangesAsync();
        }

        public async Task<Resource> Put(Resource resource)
        {
            _mycontext.Resources.Update(resource);
            await _mycontext.SaveChangesAsync();
            return resource;
        }
    }
}
