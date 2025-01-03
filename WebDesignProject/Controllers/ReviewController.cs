﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebDesignProject.Data;
using WebDesignProject.Data.Repositories.Reviews;

namespace WebDesignProject.Controllers
{
    [ApiController]
    [Route("api/resource/{resourceId}/reviews")]
    [Route("api/[controller]")]
    [Authorize] 
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
            if(review == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<ReviewDto>(review));
        }

        [HttpPost]
        public async Task<ActionResult<ReviewDto>> PostAsync(int resourceId, CreateReviewDto reviewDto)
        {
            var resource = await _resourceRepository.GetAsync(resourceId);
            
            if (resource == null)
            {
                return NotFound();
            }

            
            var userId = User.Identity?.Name;
            Console.WriteLine("\n\n\n\n\n\n\n\n\n\n" + userId);
            if (string.IsNullOrEmpty(userId))
            {
                return Forbid("User ID is not available.");
            }

           
            var review = _mapper.Map<Review>(reviewDto);
            review.ResourceId = resourceId;
            review.UserId = int.Parse(userId);

            await _reviewRepository.InsertAsync(review);

            return Created($"/api/resource/{resourceId}/reviews/{review.Id}", _mapper.Map<ReviewDto>(review));
        }


        [HttpPut("{reviewId}")]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> UpdateAsync(int resourceId, int reviewId, CreateReviewDto reviewDto)
        {
            var resource = await _resourceRepository.GetAsync(resourceId);
            if (resource == null)
            {
                return NotFound();
            }

            var oldReview = await _reviewRepository.GetAsync(resourceId, reviewId);
            if (oldReview == null)
            {
                return NotFound();
            }

            // Check if the authorized user owns the review or has admin/teacher privileges
            if (!User.IsInRole("admin") && !User.IsInRole("teacher") &&
                oldReview.UserId.ToString() != User.Identity?.Name)
            {
                return Forbid(); // Returns a standard 403 Forbidden response.
            }

            // Update the review properties
            oldReview.Comment = reviewDto.comment;
            oldReview.Rating = reviewDto.rating;

            await _reviewRepository.UpdateAsync(oldReview);

            return Ok(_mapper.Map<ReviewDto>(oldReview));
        }


        [HttpDelete("{reviewId}")]
        [Authorize]
        public async Task<IActionResult> DeleteAsync(int resourceId, int reviewId)
        {
            var review = await _reviewRepository.GetAsync(resourceId, reviewId);
            if (review == null)
            {
                return NotFound();
            }

            // Check if the authorized user owns the review
            if (!User.IsInRole("admin") && !User.IsInRole("teacher") &&
                review.UserId.ToString() != User.Identity?.Name)
            {
                return Forbid(); // No custom message is passed here.
            }

            await _reviewRepository.DeleteAsync(review);
            return NoContent();
        }

    }
}
