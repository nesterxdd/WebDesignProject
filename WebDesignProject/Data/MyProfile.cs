using AutoMapper;

namespace WebDesignProject
{
    public class MyProfile : Profile
    {
        public MyProfile()
        {
            // Resource and Review mappings 
            CreateMap<Resource, ResourceDto>();
            CreateMap<CreateResourceDto, Resource>();
            CreateMap<UpdateResourceDto, Resource>();

            // Review mappings
            CreateMap<UpdateReviewDto, Review>();
            CreateMap<CreateReviewDto, Review>();
            CreateMap<Review, ReviewDto>();

            // User mappings
            CreateMap<User, UserDto>();
            CreateMap<CreateUserDto, User>();
            CreateMap<UpdateUserDto, User>();

            // Category mappings
            CreateMap<Category, CategoryDto>();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();
        }
    }
}
