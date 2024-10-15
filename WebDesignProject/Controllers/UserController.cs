// Controllers/UserController.cs
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebDesignProject.Data.Repositories;

namespace WebDesignProject.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetAll()
        {
            return (await _userRepository.GetAsync()).Select(u => _mapper.Map<UserDto>(u));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            var user = await _userRepository.GetAsync(id);
            if (user == null) return NotFound();
            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> Post(CreateUserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            await _userRepository.InsertAsync(user);
            return Created($"/api/users/{user.Id}", _mapper.Map<UserDto>(user));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put(int id, UpdateUserDto userDto)
        {
            var user = await _userRepository.GetAsync(id);
            if (user == null) return NotFound();

            _mapper.Map(userDto, user);
            await _userRepository.UpdateAsync(user);
            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userRepository.GetAsync(id);
            if (user == null) return NotFound();
            await _userRepository.DeleteAsync(user);
            return NoContent();
        }
    }
}
