using Dal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly Roles _adminCredentials;

    public AdminController(IOptions<Roles> adminOptions)
    {
        _adminCredentials = adminOptions.Value;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] Roles loginData)
    {
        Console.WriteLine($"=== ADMIN LOGIN DEBUG ===");
        Console.WriteLine($"Received: Email={loginData?.Email}, ID={loginData?.Id}, Password={loginData?.Password}");
        Console.WriteLine($"Expected: Email={_adminCredentials?.Email}, ID={_adminCredentials?.Id}, Password={_adminCredentials?.Password}");
        
        if (loginData == null)
        {
            Console.WriteLine("ERROR: loginData is null");
            return BadRequest("No data received");
        }
        
        bool emailMatch = loginData.Email == _adminCredentials.Email;
        bool idMatch = loginData.Id == _adminCredentials.Id;
        bool passwordMatch = loginData.Password == _adminCredentials.Password;
        
        Console.WriteLine($"Email match: {emailMatch}");
        Console.WriteLine($"ID match: {idMatch}");
        Console.WriteLine($"Password match: {passwordMatch}");
        
        if (emailMatch && idMatch && passwordMatch)
        {
            Console.WriteLine("Admin login successful!");
            return Ok(new { 
                role = "Admin",
                name = _adminCredentials.FullName,
                fullName = _adminCredentials.FullName
            });
        }

        Console.WriteLine("Admin login failed - credentials don't match");
        return Unauthorized("אימייל או מזהה שגויים");
    }

}
