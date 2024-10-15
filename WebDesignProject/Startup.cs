using WebDesignProject.Data;
using AutoMapper;
using WebDesignProject.Data.Repositories;
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<MyContext>();
        services.AddAutoMapper(typeof(Startup));
        services.AddControllers();
        services.AddTransient<IResourceRepository, ResourceRepository>();
        services.AddTransient<IReviewRepository, ReviewRepository>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
