using AutoMapper;

namespace WebDesignProject.Data
{
    public class MyProfile : Profile
    {
        public MyProfile()
        {
            CreateMap<Resource, ResourceDto>();
            CreateMap<CreateResourceDto, Resource>();
            CreateMap<UpdateResourceDto, Resource>();   
        }
    }
}
