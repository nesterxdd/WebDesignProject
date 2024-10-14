using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebDesignProject.Data;

namespace WebDesignProject
{

    /* 
        resource
        /api/Resource GET ALL 200
        /api/Resource{id} GET 200
        /api/Resource POST 201
        /api/Resource/{id} PUT 200
        /api/Resource/{id} DELETE 200/204
     */
    [ApiController]
    [Route("api/[controller]")]
    public class ResourceController : ControllerBase
    {
        private readonly IResourceRepository _iresourcerepository;
        private readonly IMapper _mapper;
        public ResourceController(IResourceRepository iresourcerepository, IMapper  mapper)
        {
            _iresourcerepository = iresourcerepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<ResourceDto>> GetAll()
        {
            return (await _iresourcerepository.GetAll()).Select(o => _mapper.Map<ResourceDto>(o));
        }

        [HttpGet("{id}")]
        public async Task<Resource> Get(int id)
        {
            return await _iresourcerepository.Get(id);
        }
    }
}
