using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace WebDesignProject
{
    [ApiController]
    [Route("api/categories")]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryController(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<CategoryDto>> GetAll()
        {
            return (await _categoryRepository.GetAsync()).Select(c => _mapper.Map<CategoryDto>(c));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> Get(int id)
        {
            var category = await _categoryRepository.GetAsync(id);
            if (category == null) return NotFound();
            return Ok(_mapper.Map<CategoryDto>(category));
        }

        [HttpPost]
        [Authorize(Roles = "admin, teacher")]
        public async Task<ActionResult<CategoryDto>> Post(CreateCategoryDto categoryDto)
        {
            var category = _mapper.Map<Category>(categoryDto);
            await _categoryRepository.InsertAsync(category);
            return Created($"/api/categories/{category.Id}", _mapper.Map<CategoryDto>(category));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin, teacher")]
        public async Task<ActionResult<CategoryDto>> Put(int id, UpdateCategoryDto categoryDto)
        {
            var category = await _categoryRepository.GetAsync(id);
            if (category == null) return NotFound();

            _mapper.Map(categoryDto, category);
            await _categoryRepository.UpdateAsync(category);
            return Ok(_mapper.Map<CategoryDto>(category));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin, teacher")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _categoryRepository.GetAsync(id);
            if (category == null) return NotFound();
            await _categoryRepository.DeleteAsync(category);
            return NoContent();
        }
    }
}
