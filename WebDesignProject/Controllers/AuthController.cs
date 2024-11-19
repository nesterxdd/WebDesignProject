using Microsoft.AspNetCore.Mvc;
using WebDesignProject.Data.Dtos.Category;
using WebDesignProject;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
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
}
