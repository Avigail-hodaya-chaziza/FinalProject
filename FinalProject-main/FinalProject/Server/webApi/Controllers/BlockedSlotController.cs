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
        [HttpGet("GetBlockedDates")]
        public IActionResult GetBlockedDates()
        {
            Console.WriteLine("🔍 Getting blocked dates from DB only...");
            
            // רק חזר מה שיש ב-DB - לא טוען מ-API
            var blockedDates = _blockedSlotBl.GetAllBlockedDates();
            Console.WriteLine($"✅ Returning {blockedDates.Count} blocked dates to client");
            return Ok(blockedDates);
        }
        
        [HttpGet("RefreshFromApi")]
        public async Task<IActionResult> RefreshFromApi()
        {
            Console.WriteLine("🔄 Refreshing blocked dates from API...");
            
            var beforeCount = _blockedSlotBl.GetAllBlockedDates().Count;
            Console.WriteLine($"📊 Before API call: {beforeCount} dates in DB");
            
            await _blockedSlotBl.GetBlockedDatesFromApi();
            
            var afterCount = _blockedSlotBl.GetAllBlockedDates().Count;
            Console.WriteLine($"📊 After API call: {afterCount} dates in DB");
            
            var blockedDates = _blockedSlotBl.GetAllBlockedDates();
            return Ok(new { 
                Success = true, 
                Message = "Dates refreshed successfully",
                Count = blockedDates.Count,
                Dates = blockedDates
            });
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
                Console.WriteLine($"CountryCode received: {dto.CountryCode ?? "NULL"}");

                await _blockedSlotBl.AddBlockedDate(dto.Date, dto.HolidayName ?? "", dto.CountryCode ?? "IL");
                return Ok("Blocked date added successfully.");
            }
            catch (Exception ex)
            {
                var message = ex.InnerException?.Message ?? ex.Message;
                return BadRequest($"Error adding blocked date: {message}");
            }
        }

        [HttpGet("TestApiConnection")]
        public async Task<IActionResult> TestApiConnection()
        {
            try
            {
                var result = await _blockedSlotBl.GetBlockedDatesFromApi();
                var allSlots = _blockedSlotBl.GetAllBlockedDates();
                return Ok(new { 
                    Success = true, 
                    Message = "API connection successful", 
                    DatesCount = result.Count,
                    TotalInDB = allSlots.Count,
                    SampleDates = allSlots.Take(10).Select(x => x.Date.ToString()).ToList()
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    Success = false, 
                    Message = $"API connection failed: {ex.Message}" 
                });
            }
        }

        [HttpGet("CheckDatabase")]
        public IActionResult CheckDatabase()
        {
            try
            {
                var allSlots = _blockedSlotBl.GetAllBlockedDates();
                return Ok(new {
                    TotalCount = allSlots.Count,
                    Dates = allSlots.Select(x => new {
                        Date = x.Date.ToString(),
                        Name = x.HolidayName,
                        Year = x.Year
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

    }
}