using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDesignProject.Data.Repositories;
using WebDesignProject.Data;
using AutoMapper;
using WebDesignProject.Data.Dtos;
using System.Security.Claims;

namespace WebDesignProject.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        // Admins can get all users
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<UserDto>> GetAll()
        {
            return (await _userRepository.GetAsync()).Select(u => _mapper.Map<UserDto>(u));
        }

        // Allow a user to get their own data (if they are accessing their own user ID)
        // Teachers and Admins can get a specific user by ID (including their own)
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name)); // Get the user ID from the token

            // Allow users to access their own data
            if (id == userIdFromToken || User.IsInRole("admin") || User.IsInRole("teacher"))
            {
                var user = await _userRepository.GetAsync(id);

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(_mapper.Map<UserDto>(user));
            }

            return Unauthorized(new { message = "You can only access your own data" });
        }

        // Only Admins can create a new user
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<UserDto>> Post(CreateUserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            await _userRepository.InsertAsync(user);
            return Created($"/api/users/{user.Id}", _mapper.Map<UserDto>(user));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<UserDto>> Put(int id, UpdateUserDto userDto)
        {
            var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name)); // Extract user ID from token

            // Ensure the user is updating their own data or is an admin
            if (id != userIdFromToken && !User.IsInRole("admin"))
            {
                return Forbid("You can only update your own account.");
            }

            var user = await _userRepository.GetAsync(id);
            if (user == null)
            {
                return NotFound(); // User not found
            }

            // Retain current role if the role is not provided in the DTO
            if (userDto.Role == null)
            {
                userDto.Role = user.Role;
            }

            // Update the user data
            _mapper.Map(userDto, user);
            await _userRepository.UpdateAsync(user);

            return Ok(_mapper.Map<UserDto>(user)); // Return the updated user
        }




        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name)); // Get the user's ID from the token

            // Check if the user is trying to delete their own data, or if they are an admin
            if (id != userIdFromToken && !User.IsInRole("admin"))
            {
                return Unauthorized(new { message = "You can only delete your own account" });
            }

            var user = await _userRepository.GetAsync(id);
            if (user == null) return NotFound();

            await _userRepository.DeleteAsync(user);
            return NoContent(); 
        }


    }
}
