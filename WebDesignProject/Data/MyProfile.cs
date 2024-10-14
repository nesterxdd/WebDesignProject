using AutoMapper;

namespace WebDesignProject.Data
{
    public class MyProfile : Profile
    {
        public MyProfile()
        {
            CreateMap<Resource, ResourceDto>(); 
        }
    }
}
