using Bl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.webApi.DTOs;

namespace Server.webApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TreatmentController : ControllerBase
    {
        private readonly TreatmentBl _treatmentBl;

        public TreatmentController(TreatmentBl treatmentBl)
        {
            _treatmentBl = treatmentBl;
        }

        [HttpPost("AddTreatment")]
        //[Authorize(Roles = "Admin")]
        public IActionResult AddTreatment([FromBody] TreatmentDTOs dto)
        {
            try
            {
                Console.WriteLine($"Adding treatment: {dto.TreatmentName}, Description: {dto.Description}");
                _treatmentBl.AddTreatment(dto.TreatmentName, dto.Description, dto.TimeOfCare, dto.MinPrice);
                return Ok("Treatment added successfully.");
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"Error adding treatment: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllTreatments")]
        public ActionResult GetAllTreatments()
        {
            try
            {
                var treatments = _treatmentBl.GetAllTreatments();
                return Ok(treatments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("AddTreatmentByType")]
        [Authorize(Roles = "Admin")]

        public IActionResult AddTreatmentByType([FromBody] string TreatmentName)
        {
            try
            {
                _treatmentBl.AddTreatmentByType(TreatmentName, TreatmentName);
                return Ok("Treatment added successfully by type.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //[HttpPut("UpdateTreatment/{id}")]
        //public IActionResult UpdateTreatment(int id, [FromBody] TreatmentDTOs dto)
        //{
        //    try
        //    {
        //        _treatmentBl.UpdateTreatment(id, dto.TreatmentName, dto.TimeOfCare, dto.MinPrice); // קריאה ל-BL עם מזהה ו-DTO
        //        return Ok("Treatment updated successfully.");
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpPut("UpdateTreatment/{id}")]
        //[Authorize(Roles = "Admin")]

        public IActionResult UpdateTreatment(int id, [FromBody] TreatmentDTOs dto)
        {
            try
            {
                _treatmentBl.UpdateTreatment(id, dto.Description, dto.TreatmentName, dto.TimeOfCare, dto.MinPrice);
                return Ok("Treatment updated successfully.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("DeleteTreatment/{id}")]
        //[Authorize(Roles = "Admin")]

        public IActionResult DeleteTreatment(int id)
        {
            try
            {
                _treatmentBl.DeleteTreatment(id);
                return Ok("Treatment deleted successfully.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
