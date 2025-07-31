using Dal.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Extensions.Options; 
using Microsoft.AspNetCore.Authentication;

[ApiController]
[Route("[controller]")]
public class AccountController : ControllerBase
{
    private readonly Roles _adminCredentials;

    public AccountController(IOptions<Roles> adminOptions)
    {
        _adminCredentials = adminOptions.Value;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] Roles model)
    {
        if (model.FullName == _adminCredentials.FullName && model.Password == _adminCredentials.Password)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, model.FullName),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity));

            return Ok("Logged in");
        }

        return Unauthorized("Invalid credentials");
    }

    [HttpPost("Logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok("Logged out");
    }
}
