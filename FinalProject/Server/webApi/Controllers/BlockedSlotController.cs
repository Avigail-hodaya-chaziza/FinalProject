using Bl;
using Microsoft.AspNetCore.Mvc;

namespace Server.webApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlockedSlotController : ControllerBase
    {
        private readonly BlockedSlotBl _blockedSlotBl;
        public BlockedSlotController(BlockedSlotBl blockedSlotBl)
        {
            _blockedSlotBl = blockedSlotBl;
        }
        [HttpGet("GetBlockedDatesFromApi")]
        public async Task<IActionResult> GetBlockedDatesFromApi()
        {
            var result = await _blockedSlotBl.GetBlockedDatesFromApi();
            return Ok(result);
        }
        [HttpGet("IsDateAvailable")]
        public IActionResult IsDateAvailable([FromQuery] DateOnly date)
        {
            bool isAvailable = _blockedSlotBl.IsDateAvailable(date);
            return Ok(isAvailable);
        }
        [HttpPost("AddBlockedDate")]
        public async Task<IActionResult> AddBlockedDate([FromBody] DateOnly date, [FromQuery] string holidayName)
        {
            try
            {
                await _blockedSlotBl.AddBlockedDate(date, holidayName);
                return Ok("Blocked date added successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error adding blocked date: {ex.Message}");
            }

        }
    }
}
