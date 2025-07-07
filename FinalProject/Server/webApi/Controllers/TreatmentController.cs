using Bl;
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
        public IActionResult AddTreatment([FromBody] TreatmentDTOs dto)
        {
            try
            {
                _treatmentBl.AddTreatment(dto.TreatmentName, dto.TimeOfCare, dto.MinPrice);
                return Ok("Treatment added successfully.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AddTreatmentByType")]
        public IActionResult AddTreatmentByType([FromBody] TreatmentDTOs dto)
        {
            try
            {
                _treatmentBl.AddTreatmentByType(dto.TreatmentName, dto.TreatmentName);
                return Ok("Treatment added successfully by type.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
