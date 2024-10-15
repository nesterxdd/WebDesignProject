using Microsoft.AspNetCore.Mvc;
using WebDesignProject.Data.Dtos.Reviews;

namespace WebDesignProject.Controllers
{
    [ApiController]
    [Route("api/resource/{resourceId}/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly object _reviewRepository;
        private readonly object _mapper;

        public ReviewController()
        {

        }

        //[HttpGet]
        //public async Task<IEnumerable<ReviewDto>> GetAll(int resourceId)
        //{
        //    //return (await _reviewRepository.GetAll(resourceId)).Select(o => _mapper.Map<ReviewDto>(o));
        //}
    }
}
