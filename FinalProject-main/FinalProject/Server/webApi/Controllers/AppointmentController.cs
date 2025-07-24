//using Bl;
//using Dal.Models;
//using Microsoft.AspNetCore.Mvc;
//using Serilog;
//using Server.webApi.DTOs;

//namespace Server.webApi.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class AppointmentController : ControllerBase
//    {
//        private readonly AppointmentBl _appointmentBl;
//        private readonly ILogger<AppointmentController> _logger;

//        public AppointmentController(AppointmentBl appointmentBl, ILogger<AppointmentController> logger )
//        {
//            _appointmentBl = appointmentBl;
//            _logger = logger;

//        }

//        public AppointmentBl AppointmentBl => _appointmentBl;

//        [HttpPost("AddAppointment")]
//        public ActionResult<bool> AddAppointment([FromBody] AppointmentDTOs appointmentRequest)
//        {
//            if (appointmentRequest == null)
//            {
//                _logger.LogInformation("Adding appointment for user faild is null");
//                return BadRequest("Invalid appointment request.");
//            }

//            var result = _appointmentBl.AddAppointment(
//                appointmentRequest.Customer,
//                appointmentRequest.ScheduledTime,
//                appointmentRequest.Treatment);

//            if (!result)
//            {
//                return StatusCode(400,"Failed to add appointment.");
//            }

//            return Ok(true);
//        }
//        [HttpGet("GetAvailableDates")]
//        public ActionResult <List<DateOnly>> GetAvailableDates()
//        {
//        var availableDates = _appointmentBl.GetAvailableDates();
//            return Ok(availableDates);
//        }
//        [HttpDelete("DeleteAppointment")]
//        public ActionResult<bool> DeleteAppointment([FromBody] DateOnly date)
//        {
//            var result = _appointmentBl.DeleteAppointment(date);

//            if (!result)
//            {
//                return StatusCode(400, "Failed to delete appointment.");
//            }
//            return Ok(true);
//        }

//        [HttpPut("/*GetBlockedDates*/UpdateAppointment")]
//        public ActionResult UpdateAppointment([FromBody] AppointmentDTOs appointmentDTOs)
//        {
//            var success = _appointmentBl.UpdateAppointment(appointmentDTOs.Customer, appointmentDTOs.ScheduledTime, appointmentDTOs.Treatment);
//            if (success)
//                return Ok("Appointment updated successfully.");
//            else
//                return BadRequest("Failed to update appointment.");
//        }

//        [HttpDelete("DeleteAppointmentsBeforeCurrentYear")]
//        public ActionResult <bool> DeleteAppointmentsBeforeCurrentYear() 
//        {
//            bool success = _appointmentBl.DeleteAppointmentsBeforeCurrentYear();
//            if (!success)
//            {
//                Log.Warning("Failed to delete appointments.");
//            }
//            return Ok(success);
//        }

//        [HttpGet("GetAppointmentsByCustomerId/{customerId}")]
//        public ActionResult<List<Appointment>> GetAppointmentsByCustomerId(int customerId)
//        {
//            var appointments = _appointmentBl.GetAppointmentsByCustomerId(customerId);
//            return Ok(appointments);
//        }

//        [HttpGet("GetAppointmentsInRange")]
//        public ActionResult<List<Appointment>> GetAppointmentsInRange([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
//        {
//            var appointments = _appointmentBl.GetAppointmentsInRange(startDate, endDate);
//            return Ok(appointments);
//        }

//        [HttpGet("GetUpcomingAppointments")]
//        public ActionResult<List<Appointment>> GetUpcomingAppointments()
//        {
//            var appointments = _appointmentBl.GetUpcomingAppointments();
//            return Ok(appointments);
//        }


//    }



//}

using Bl;
using Dal.Models;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Server.webApi.DTOs;

namespace Server.webApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly AppointmentBl _appointmentBl;
        private readonly ILogger<AppointmentController> _logger;

        public AppointmentController(AppointmentBl appointmentBl, ILogger<AppointmentController> logger)
        {
            _appointmentBl = appointmentBl;
            _logger = logger;
        }

        [HttpPost("AddAppointment")]
        public ActionResult AddAppointment([FromBody] AppointmentDTOs appointmentRequest)
        {
            if (appointmentRequest == null)
            {
                _logger.LogInformation("Adding appointment failed: request is null");
                return BadRequest("הבקשה להוספת תור אינה תקינה.");
            }

            try
            {
                var result = _appointmentBl.AddAppointment(
                    appointmentRequest.CustomerId,
                    appointmentRequest.ScheduledTime,
                    appointmentRequest.TreatmentId);

                if (!result)
                {
                    return BadRequest("לא ניתן להוסיף את התור. ייתכן שהתאריך תפוס, חסום, או לא תקין.");
                }

                return Ok("Appointment added successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בעת ניסיון להוספת תור.");
                return StatusCode(500, $"אירעה שגיאה בשרת: {ex.Message}");
            }
        }

        //נראה לי שזה לא קשור לפה...
        [HttpGet("GetAvailableDates")]
        public ActionResult<List<DateOnly>> GetAvailableDates()
        {
            var availableDates = _appointmentBl.GetAvailableDates();
            return Ok(availableDates);
        }

        [HttpDelete("DeleteAppointment")]
        public ActionResult<bool> DeleteAppointment([FromBody] DateOnly date)
        {
            var result = _appointmentBl.DeleteAppointment(date);

            if (!result)
            {
                return StatusCode(400, "Failed to delete appointment.");
            }
            return Ok(true);
        }

        [HttpPut("UpdateAppointment")]//לשים לב שכרגע הוא צריך לקבל את כל הפרטים ואי אפשר להשאיר NULL
        public ActionResult UpdateAppointment([FromBody] AppointmentDTOs appointmentDTOs)
        {
            if (appointmentDTOs == null)
            {
                _logger.LogInformation("Updating appointment failed: request is null");
                return BadRequest("Invalid appointment request.");
            }

            var success = _appointmentBl.UpdateAppointment(appointmentDTOs.CustomerId, appointmentDTOs.ScheduledTime, appointmentDTOs.TreatmentId);
            if (success)
                return Ok("Appointment updated successfully.");
            else
                return BadRequest("Failed to update appointment.");
        }

        [HttpDelete("DeleteAppointmentsBeforeCurrentYear")]
        public ActionResult<bool> DeleteAppointmentsBeforeCurrentYear()
        {
            bool success = _appointmentBl.DeleteAppointmentsBeforeCurrentYear();
            if (!success)
            {
                _logger.LogWarning("Failed to delete old appointments.");
            }
            return Ok(success);
        }

        [HttpGet("GetAppointmentsByCustomerId/{customerId}")]
        public ActionResult<List<Appointment>> GetAppointmentsByCustomerId([FromBody] int customerId)
        {
            var appointments = _appointmentBl.GetAppointmentsByCustomerId(customerId);
            return Ok(appointments);
        }

        [HttpGet("GetAppointmentsInRange")]
        public ActionResult<List<Appointment>> GetAppointmentsInRange([FromBody] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            var appointments = _appointmentBl.GetAppointmentsInRange(startDate, endDate);
            return Ok(appointments);
        }

        [HttpGet("GetUpcomingAppointments")]
        public ActionResult<List<Appointment>> GetUpcomingAppointments()
        {
            var appointments = _appointmentBl.GetUpcomingAppointments();
            return Ok(appointments);
        }

        [HttpGet("GetAllAppointments")]
        public ActionResult<List<Appointment>> GetAllAppointments()
        {
            var appointments = _appointmentBl.GetAllAppointments();
            return Ok(appointments);
        }

        //צריך להוסיף שינוי סטטוס של פגישה

    }
}
