using Bl;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using Server.webApi.DTOs;

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
        public async Task<IActionResult> AddBlockedDate([FromBody] BlockedSlotDTOs dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(ms => ms.Value.Errors.Count > 0)
                    .Select(ms => new {
                        Field = ms.Key,
                        Errors = ms.Value.Errors.Select(e => e.ErrorMessage).ToList()
                    });

                return BadRequest(errors); // מחזיר פירוט ברור על מה נכשל
            }

            try
            {
                await _blockedSlotBl.AddBlockedDate(dto.Date, dto.HolidayName);
                return Ok("Blocked date added successfully.");
            }
            catch (Exception ex)
            {
                var message = ex.InnerException?.Message ?? ex.Message;
                return BadRequest($"Error adding blocked date: {message}");
            }
        }

    }
}