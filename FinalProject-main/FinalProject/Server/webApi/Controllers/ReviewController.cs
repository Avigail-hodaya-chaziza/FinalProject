using Dal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Server.webApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly dbClass _context;

        public ReviewController(dbClass context)
        {
            _context = context;
        }

        [HttpPost("AddReview")]
        public async Task<ActionResult> AddReview([FromBody] Review review)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                review.CreatedAt = DateTime.Now;
                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();

                return Ok("ביקורת נוספה בהצלחה");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה בשרת: {ex.Message}");
            }
        }

        [HttpGet("GetAllReviews")]
        public async Task<ActionResult<List<Review>>> GetAllReviews()
        {
            try
            {
                var reviews = await _context.Reviews
                    .OrderByDescending(r => r.CreatedAt)
                    .ToListAsync();
                
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה בשרת: {ex.Message}");
            }
        }

        [HttpGet("GetAverageRating")]
        public async Task<ActionResult<object>> GetAverageRating()
        {
            try
            {
                var reviews = await _context.Reviews.ToListAsync();
                
                if (!reviews.Any())
                {
                    return Ok(new { averageRating = 0.0, totalReviews = 0 });
                }

                var averageRating = reviews.Average(r => r.Rating);
                var totalReviews = reviews.Count;

                return Ok(new { 
                    averageRating = Math.Round(averageRating, 1), 
                    totalReviews = totalReviews 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה בשרת: {ex.Message}");
            }
        }
    }
}