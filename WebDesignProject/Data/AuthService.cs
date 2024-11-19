using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebDesignProject.Data;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using WebDesignProject.Data.Repositories;

namespace WebDesignProject
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<string> AuthenticateUser(string email, string password)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            // Validate password (in a real app, use a hashing function to compare)
            if (user.PasswordHash != password)
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("ThisIsASecretKeyForJwtThatIsExactly32BytesLong!");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Aud, "WebDesignProjectAPI"), 
            new Claim(JwtRegisteredClaimNames.Iss, "https://localhost") 
        }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return tokenString;
        }


    }
}
