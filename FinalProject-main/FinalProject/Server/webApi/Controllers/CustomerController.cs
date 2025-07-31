using Bl;
using Dal.Models;
using Microsoft.AspNetCore.Authorization;
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
                Console.WriteLine("קיבלנו לקוח:");

                // הערך של isContacted יהיה תמיד true כשלא מצוין אחרת (אתה יכול לשנות את זה לפי הצורך)
                bool isContacted = false;  // ניתן לשנות פה אם יש לך לוגיקה אחרת לקביעת הערך

                // קריאה לפונקציה ב-BL
                _customerBl.AddCustomer(customerDto.Id, customerDto.FirstName,
                    customerDto.LastName, customerDto.PhoneNumber, customerDto.Email, isContacted);

                return Ok("Customer added successfully.");
            }
            catch (ArgumentException ex)
            {
                // אם יש בעיה בנתונים, מחזירים הודעת שגיאה
                Console.WriteLine("שגיאה בשרת: " + ex.Message);
                return StatusCode(500, new { error = "שגיאה בשרת", details = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
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
                _customerBl.UpdateCustomer(customerDto.Id, customerDto.FirstName,
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

        [HttpPut("contact/{id}")]
        [Authorize(Roles = "Admin")]

        public IActionResult ContactCustomer([FromBody] int id)
        {
            try
            {
                _customerBl.ContactCustomer(id);
                return Ok($"Customer with ID {id} has been contacted.");
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
        public ActionResult<List<Customer>> GetUncontactedCustomers()
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

        [HttpGet("FindByIdAndemail")]
        public IActionResult FindByIdAndemail(int id, string email)
        {
            try
            {
                var customer = _customerBl.FindByIdAndEmail(id, email);

                // אם לא מצא לפי ת"ז ואימייל – נבדוק אם קיים לפחות לפי ת"ז
                if (customer == null)
                {
                    bool exists = _customerBl.ExistsById(id);
                    Console.WriteLine($"customerId: {id}, email: {email}, exists: {exists}");

                    if (exists)
                    {
                        return NotFound("אימייל לא תואם ללקוח קיים");
                    }

                    return NotFound("לקוח לא נמצא");
                }

                // מצא את הלקוח
                return Ok(customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאת שרת: {ex.Message}");
            }
        }

       
    }
}
