using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
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
        [Authorize(Roles = "admin, teacher")] 
        public async Task<ActionResult<Resource>> Post(CreateResourceDto resourceDto)
        {
            var resource = _mapper.Map<Resource>(resourceDto);

            // Insert the resource with categories
            await _iresourcerepository.InsertAsync(resource, resourceDto.categoriesIDs);

            return Created($"/api/resource/{resource.Id}", _mapper.Map<ResourceDto>(resource));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin, teacher")]
        public async Task<ActionResult<Resource>> Put(int id, UpdateResourceDto updateResourceDto)
        {
            var resource = await _iresourcerepository.GetAsync(id);
            if (resource == null)
            {
                return NotFound($"Resource with id:{id} does not exist");
            }

            // Update the resource properties and associate categories
            _mapper.Map(updateResourceDto, resource);
            await _iresourcerepository.UpdateAsync(resource, updateResourceDto.categoriesIDs);

            return Ok(_mapper.Map<ResourceDto>(resource));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
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
