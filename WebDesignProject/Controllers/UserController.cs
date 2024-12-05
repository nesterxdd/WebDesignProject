using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDesignProject.Data.Repositories;
using WebDesignProject.Data;
using AutoMapper;
using WebDesignProject.Data.Dtos;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using WebDesignProject.Data.Repositories.Reviews;

namespace WebDesignProject.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IReviewRepository _reviewRepository;

        public UserController(IUserRepository userRepository, IMapper mapper, IReviewRepository reviewrepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _reviewRepository = reviewrepository;
        }

        // Admins can get all users
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<UserDto>> GetAll()
        {
            return (await _userRepository.GetAsync()).Select(u => _mapper.Map<UserDto>(u));
        }

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

                var userDto = _mapper.Map<UserDto>(user); // Ensure CreatedAt is included
                return Ok(userDto);
            }

            return Unauthorized(new { message = "You can only access your own data" });
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<UserDto>> Post(CreateUserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            // Directly assign the plain password instead of hashing
            user.PasswordHash = userDto.PasswordHash;

            await _userRepository.InsertAsync(user);
            return Created($"/api/users/{user.Id}", _mapper.Map<UserDto>(user));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<UserDto>> Put(int id, UpdateUserDto userDto)
        {
            var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name));
            var isAdmin = User.IsInRole("admin");

            // Validate user permissions
            if (id != userIdFromToken && !isAdmin)
            {
                return Forbid("You can only update your own account.");
            }

            var user = await _userRepository.GetAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Update name and email
            user.Name = userDto.Name ?? user.Name;
            user.Email = userDto.Email ?? user.Email;

            // Update password if provided
            if (!string.IsNullOrEmpty(userDto.Password))
            {
                // For non-admins, verify the current password first
                if (!isAdmin && user.PasswordHash != userDto.CurrentPassword)
                {
                    return BadRequest(new { message = "Current password is incorrect." });
                }

                user.PasswordHash = userDto.Password; // Assign new password directly (consider hashing in production)
            }

            // Update roles if admin
            if (isAdmin && !string.IsNullOrEmpty(userDto.Role))
            {
                user.Role = userDto.Role;
            }

            try
            {
                await _userRepository.UpdateAsync(user);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "An error occurred while saving changes.", details = ex.Message });
            }

            return Ok(_mapper.Map<UserDto>(user));
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

        // UserController.cs
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetUserData()
        {
            var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name)); // Get user ID from the token

            var user = await _userRepository.GetAsync(userIdFromToken); // Fetch user from the database

            if (user == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<UserDto>(user)); // Return the user data
        }

        [HttpPut("update-password/{id}")]
        [Authorize]
        public async Task<ActionResult<UserDto>> UpdatePassword(int id, UpdatePasswordDto passwordDto)
        {
            var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name));
            var isAdmin = User.IsInRole("admin");

            // Validate user permissions
            if (id != userIdFromToken && !isAdmin)
            {
                return Forbid("You can only update your own account.");
            }

            var user = await _userRepository.GetAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Check if new password matches confirmation
            if (passwordDto.NewPassword != passwordDto.ConfirmPassword)
            {
                return BadRequest(new { message = "New password and confirmation do not match." });
            }

            // If the user is not an admin, validate the current password (plain text comparison)
            if (!isAdmin && user.PasswordHash != passwordDto.CurrentPassword)
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }

            // Update password directly with the new one (no hashing)
            user.PasswordHash = passwordDto.NewPassword;

            try
            {
                await _userRepository.UpdateAsync(user);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "An error occurred while saving changes.", details = ex.Message });
            }

            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpGet("{userId}/reviews")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetUserReviews(int userId)
        {
            // Validate that the logged-in user matches the requested userId, or allow admin access
            var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name));
            if (userIdFromToken != userId && !User.IsInRole("admin"))
            {
                return Forbid("You can only view your own reviews.");
            }

            // Fetch reviews for the user
            var reviews = await _reviewRepository.GetReviewsByUserAsync(userId);

            if (!reviews.Any())
            {
                return NotFound("No reviews found for this user.");
            }

            return Ok(reviews.Select(r => _mapper.Map<ReviewDto>(r)));
        }

        [HttpGet("me/reviews")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetCurrentUserReviews()
        {
            var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name));
            return await GetUserReviews(userIdFromToken);
        }




    }
}
