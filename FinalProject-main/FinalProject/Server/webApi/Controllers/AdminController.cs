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
        Console.WriteLine("Received login for: " + loginData.Email);
        if (loginData.Email == _adminCredentials.Email &&
            loginData.Id == _adminCredentials.Id)
        {
            return Ok(new { role = "Admin", name = loginData.FullName });
        }

        return Unauthorized("אימייל או מזהה שגויים");
    }

}
