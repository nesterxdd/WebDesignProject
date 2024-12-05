using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebDesignProject.Data.Repositories.Reviews;
using WebDesignProject;

[ApiController]
[Route("api/reviews")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IMapper _mapper;

    public ReviewController(IReviewRepository reviewRepository, IMapper mapper)
    {
        _reviewRepository = reviewRepository;
        _mapper = mapper;
    }

    // Fetch a review by reviewId
    [HttpGet("{reviewId}")]
    public async Task<ActionResult<ReviewDto>> GetByReviewId(int reviewId)
    {
        // Fetch the review by ID
        var review = await _reviewRepository.GetByIdAsync(reviewId);

        if (review == null)
        {
            return NotFound(new { message = "Review not found." });
        }

        // Check permissions: Admins, teachers, or the review owner
        var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name));
        var isAdminOrTeacher = User.IsInRole("admin") || User.IsInRole("teacher");

        if (!isAdminOrTeacher && review.UserId != userIdFromToken)
        {
            return Forbid("You do not have permission to access this review.");
        }

        // Return the review if authorized
        return Ok(_mapper.Map<ReviewDto>(review));
    }

    [HttpPut("{reviewId}")]
    public async Task<ActionResult<ReviewDto>> UpdateReview(int reviewId, UpdateReviewDto reviewDto)
    {
        // Fetch the review by ID
        var review = await _reviewRepository.GetByIdAsync(reviewId);

        if (review == null)
        {
            return NotFound(new { message = "Review not found." });
        }

        // Check permissions: Allow only the review owner or admins to edit
        var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name));
        var isAdmin = User.IsInRole("admin");

        if (!isAdmin && review.UserId != userIdFromToken)
        {
            return Forbid("You do not have permission to edit this review.");
        }

        // Update review properties
        review.Comment = reviewDto.Comment;
        review.Rating = reviewDto.Rating;
        review.UpdatedAt = DateTime.UtcNow; // Set the updated timestamp

        // Save changes to the database
        await _reviewRepository.UpdateAsync(review);

        // Return the updated review
        return Ok(_mapper.Map<ReviewDto>(review));
    }


    // Delete a review by reviewId
    [HttpDelete("{reviewId}")]
    public async Task<IActionResult> DeleteReview(int reviewId)
    {
        // Fetch the review by ID
        var review = await _reviewRepository.GetByIdAsync(reviewId);

        if (review == null)
        {
            return NotFound(new { message = "Review not found." });
        }

        // Check permissions: Allow only the review owner or admins to delete
        var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name));
        var isAdmin = User.IsInRole("admin");

        if (!isAdmin && review.UserId != userIdFromToken)
        {
            return Forbid("You do not have permission to delete this review.");
        }

        // Delete the review
        await _reviewRepository.DeleteAsync(review);

        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewDto createReviewDto)
    {
        if (createReviewDto == null)
        {
            return BadRequest(new { message = "Invalid review data." });
        }

        // Get the current user's ID from the token
        var userIdFromToken = int.Parse(User.FindFirstValue(ClaimTypes.Name));

        // Ensure the UserId is either not specified or matches the authenticated user
        if (createReviewDto.UserId != 0 && createReviewDto.UserId != userIdFromToken && !User.IsInRole("admin"))
        {
            return Forbid(); // Properly uses 403 Forbidden instead of a string message
        }

        // Assign the current user ID if UserId is not explicitly set
        createReviewDto = createReviewDto with { UserId = userIdFromToken };

        // Map the DTO to the Review entity
        var review = _mapper.Map<Review>(createReviewDto);

        // Set creation timestamp
        review.CreatedAt = DateTime.UtcNow;

        // Save the review in the database
        await _reviewRepository.InsertAsync(review);

        // Map the saved review back to a DTO and return it
        var reviewDto = _mapper.Map<ReviewDto>(review);

        return CreatedAtAction(nameof(GetByReviewId), new { reviewId = reviewDto.Id }, reviewDto);
    }




}
