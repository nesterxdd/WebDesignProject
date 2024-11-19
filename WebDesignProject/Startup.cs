using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;
using WebDesignProject.Data.Repositories.Reviews;
using WebDesignProject.Data.Repositories;
using WebDesignProject.Data;
using WebDesignProject;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Database context
        services.AddDbContext<MyContext>(options =>
            options.UseSqlServer("Server=DESKTOP-HQEF13N\\SQLEXPRESS;Database=WebDesignProject;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;"));

        // Registering AuthService as a scoped service
        services.AddScoped<AuthService>(); // Add this line

        services.AddAutoMapper(typeof(Startup));

        services.AddControllers();

        // Repositories
        services.AddTransient<IResourceRepository, ResourceRepository>();
        services.AddTransient<IReviewRepository, ReviewRepository>();
        services.AddTransient<ICategoryRepository, CategoryRepository>();
        services.AddTransient<IUserRepository, UserRepository>();



        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "https://localhost",
                    ValidAudience = "WebDesignProjectAPI",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsASecretKeyForJwtThatIsExactly32BytesLong!")) 
                };
            });

        // Authorization policies
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
            options.AddPolicy("TeacherOrAdmin", policy => policy.RequireRole("teacher", "admin"));
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        // Enable Authentication and Authorization middleware
        app.UseRouting();

        // Authentication middleware
        app.UseAuthentication();
        app.UseAuthorization();

        // Endpoint configuration
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
