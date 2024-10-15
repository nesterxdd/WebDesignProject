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
        public ResourceController(IResourceRepository iresourcerepository, IMapper mapper)
        {
            _iresourcerepository = iresourcerepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<ResourceDto>> GetAll()
        {
            return (await _iresourcerepository.GetAsync()).Select(o => _mapper.Map<ResourceDto>(o));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Resource>> Get(int id)
        {
            var resource = await _iresourcerepository.GetAsync(id);
            if (resource == null)
            {
                return NotFound($"topic with id:{id} does not exist");
            }
            //return _mapper.Map<ResourceDto>(resource);
            return Ok(_mapper.Map<ResourceDto>(resource));
        }

        [HttpPost]
        public async Task<ActionResult<Resource>> Post(CreateResourceDto resourcedto)
        {
            var resource = _mapper.Map<Resource>(resourcedto);
            await _iresourcerepository.InsertAsync(resource);

            //201
            //Created Resource
            return Created($"/api/topics/{resource.Id}", _mapper.Map<ResourceDto>(resource));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Resource>> Put(int id, UpdateResourceDto updateResourceDto)
        {
            var resource = await _iresourcerepository.GetAsync(id);
            if (resource == null)
            {
                return NotFound($"topic with id:{id} does not exist");
            }

            _mapper.Map(updateResourceDto, resource);

            await _iresourcerepository.UpdateAsync(resource);

            //return _mapper.Map<ResourceDto>(resource);
            return Ok(_mapper.Map<ResourceDto>(resource));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Resource>> Delete(int id)
        {
            var resource = await _iresourcerepository.GetAsync(id);
            if (resource == null)
            {
                return NotFound($"topic with id:{id} does not exist");
            }
            await _iresourcerepository.DeleteAsync(resource);

            //204
            return NoContent();
        }
    }
}
