using Bl;
using Dal.Models;
using Microsoft.AspNetCore.Mvc;
using Server.webApi.DTOs;

namespace Server.webApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerBl _customerBl;
        public CustomerController(CustomerBl customerBl)
        {
            _customerBl = customerBl;
        }
        [HttpPost("AddCustomer")]
        public ActionResult AddCustomer([FromBody] CustomerDto customerDto)
        {
            try
            {
                // הערך של isContacted יהיה תמיד true כשלא מצוין אחרת (אתה יכול לשנות את זה לפי הצורך)
                bool isContacted = false;  // ניתן לשנות פה אם יש לך לוגיקה אחרת לקביעת הערך

                // קריאה לפונקציה ב-BL
                _customerBl.AddCustomer(customerDto.CustomerId, customerDto.FirstName,
                    customerDto.LastName, customerDto.PhoneNumber, customerDto.Email, isContacted);

                return Ok("Customer added successfully.");
            }
            catch (ArgumentException ex)
            {
                // אם יש בעיה בנתונים, מחזירים הודעת שגיאה
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllCustomers")]
        public ActionResult<List<CustomerDto>> GetAllCustomers()
        {
            try
            {
                var customers = _customerBl.GetAllCustomers();
                return Ok(customers); // מחזיר 200 OK עם רשימת לקוחות
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("UpdateCustomer")]
        public ActionResult UpdateCustomer([FromBody] CustomerDto customerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _customerBl.UpdateCustomer(customerDto.CustomerId, customerDto.FirstName,
                    customerDto.LastName, customerDto.PhoneNumber, customerDto.Email);
                return Ok("Customer updated successfully.");
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("contact/{customerId}")]
        public IActionResult ContactCustomer([FromBody] int customerId)
        {
            try
            {
                _customerBl.ContactCustomer(customerId);
                return Ok($"Customer with ID {customerId} has been contacted.");
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message); // לקוח לא קיים
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }

        [HttpGet("GetUncontactedCustomers")]
        public IActionResult GetUncontactedCustomers()
        {
            try
            {
                var customers = _customerBl.GetUncontactedCustomers();
                return Ok(customers); // מחזיר 200 OK עם רשימת לקוחות
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }

    }
}
