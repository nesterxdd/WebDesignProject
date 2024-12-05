using Microsoft.AspNetCore.Mvc;
using WebDesignProject.Data.Dtos.Category;
using WebDesignProject;
using WebDesignProject.Data.Repositories;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IUserRepository _userRepository;

    public AuthController(AuthService authService, IUserRepository userRepository)
    {
        _authService = authService;
        _userRepository = userRepository;
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var token = await _authService.AuthenticateUser(loginDto.Email, loginDto.Password);
            return Ok(new { Token = token });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { Message = "Invalid credentials" });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDto userDto)
    {
        try
        {
            // Validate incoming data
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid data", details = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            var hashedPassword = (userDto.PasswordHash); // Hash the password here

            // Map DTO to domain model (User)
            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                PasswordHash = hashedPassword, // Store the hashed password
                Role = userDto.Role
            };

            // Insert user into repository
            await _userRepository.InsertAsync(user);

            return Ok(new { message = "User registered successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }


   
}
