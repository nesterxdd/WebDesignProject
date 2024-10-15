using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebDesignProject.Data;
using WebDesignProject.Data.Dtos.Reviews;
using WebDesignProject.Data.Repositories;

namespace WebDesignProject.Controllers
{
    [ApiController]
    [Route("api/resource/{resourceId}/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IMapper _mapper;
        private readonly IResourceRepository _resourceRepository;

        public ReviewController(IReviewRepository reviewRepository, IMapper mapper, IResourceRepository resourceRepository)
        {
            _reviewRepository = reviewRepository;
            _mapper = mapper;
            _resourceRepository = resourceRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<ReviewDto>> GetAll(int resourceId)
        {
            var reviews = await _reviewRepository.GetAsync(resourceId);
            return reviews.Select(r => _mapper.Map<ReviewDto>(r));
        }

        [HttpGet("{reviewId}")]
        public async Task<ActionResult<ReviewDto>> Get(int resourceId, int reviewId)
        {
            var review = await _reviewRepository.GetAsync(resourceId, reviewId);
            if (review == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<ReviewDto>(review));
        }

        [HttpPost]
        public async Task<ActionResult<ReviewDto>> PostAsync(CreateReviewDto reviewDto)
        {
            var resource = await _resourceRepository.Get(reviewDto.resourceId);
            if (resource == null)
            {
                return NotFound();
            }
            var review = _mapper.Map<Review>(reviewDto);
            review.ResourceId = reviewDto.resourceId;

            await _reviewRepository.InsertAsync(review);

            return Created($"/api/resource/{reviewDto.resourceId}/reviews/{review.Id}", _mapper.Map<ReviewDto>(review));
        }

        [HttpPut("{reviewId}")]
        public async Task<ActionResult<ReviewDto>> UpdateAsync(int resourceId, int reviewId, CreateReviewDto reviewDto)
        {
            var resource = await _resourceRepository.Get(resourceId);
            if (resource == null)
            {
                return NotFound();
            }
            var oldReview = await _reviewRepository.GetAsync(resourceId, reviewId);
            if (oldReview == null)
            {
                return NotFound();
            }

            _mapper.Map(reviewDto, oldReview);

            await _reviewRepository.UpdateAsync(oldReview);

            return Ok(_mapper.Map<ReviewDto>(oldReview));
        }

        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteAsync(int resourceId, int reviewId)
        {
            var review = await _reviewRepository.GetAsync(resourceId, reviewId);
            if (review == null)
            {
                return NotFound();
            }
            await _reviewRepository.DeleteAsync(review);
            return NoContent();
        }
    }
}
