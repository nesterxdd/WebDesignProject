using AutoMapper;
using WebDesignProject.Data.Dtos.Reviews;

namespace WebDesignProject.Data
{
    public class MyProfile : Profile
    {
        public MyProfile()
        {
            CreateMap<Resource, ResourceDto>();
            CreateMap<CreateResourceDto, Resource>();
            CreateMap<UpdateResourceDto, Resource>();   
            CreateMap<CreateReviewDto, Review>();
            CreateMap<Review, ReviewDto>();
            CreateMap<UpdateReviewDto, Review>();
        }
    }
}
