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
                Console.WriteLine($"קיבלנו לקוח: {customerDto.FullName}, {customerDto.PhoneNumber}, {customerDto.Email}");

                if (!ModelState.IsValid)
                {
                    Console.WriteLine("ModelState לא תקין:");
                    foreach (var error in ModelState)
                    {
                        Console.WriteLine($"{error.Key}: {string.Join(", ", error.Value.Errors.Select(e => e.ErrorMessage))}");
                    }
                    return BadRequest(ModelState);
                }

                _customerBl.AddCustomer(customerDto.FullName, customerDto.PhoneNumber, customerDto.Email);

                return Ok("Customer added successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("שגיאה בשרת: " + ex.Message);
                Console.WriteLine("Stack trace: " + ex.StackTrace);
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
                _customerBl.UpdateCustomer(customerDto.CustomerId, customerDto.FullName,
                    customerDto.PhoneNumber, customerDto.Email);
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
        [AllowAnonymous]
        public IActionResult ContactCustomer(int customerId)
        {
            Console.WriteLine($"ContactCustomer called with ID: {customerId}");
            try
            {
                _customerBl.ContactCustomer(customerId);
                return Ok($"Customer with ID {customerId} has been contacted.");
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"ArgumentException: {ex.Message}");
                return NotFound(ex.Message); // לקוח לא קיים
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
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

        [HttpGet("FindByNameAndEmail")]
        public IActionResult FindByNameAndEmail(string name, string email)
        {
            try
            {
                var customer = _customerBl.FindByNameAndEmail(name, email);

                if (customer == null)
                {
                    bool exists = _customerBl.ExistsByName(name);
                    Console.WriteLine($"name: {name}, email: {email}, exists: {exists}");

                    if (exists)
                    {
                        return NotFound("אימייל לא תואם ללקוח קיים");
                    }

                    return NotFound("לקוח לא נמצא");
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאת שרת: {ex.Message}");
            }
        }

       
    }
}
