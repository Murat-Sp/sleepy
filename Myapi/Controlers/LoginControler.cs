using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using System.Runtime.ExceptionServices;
using Azure.Identity;
using Microsoft.AspNetCore.Identity;
namespace MyApi.Services;


[ApiController]
[Route("api/[controller]")]

public class LoginController : ControllerBase
{   
    private readonly UserService _userService;

    public LoginController(UserService userService)
    {
        _userService = userService;
    }
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    { 
       var user = await _userService.GetByEmailAsync(loginDto.email);
       if (user == null)
        return Unauthorized("Користувача не знайдено");

          var passwordService = new PasswordService();
        bool isValid = passwordService.VerifyPassword(user.Password, loginDto.password);
        if (!isValid)
            return Unauthorized("Невірний пароль");

                HttpContext.Session.SetString("Name", user.Name);
                HttpContext.Session.SetString("LastName", user.LastName);
            return Ok(
              user);
        }
    [HttpGet("user")]
    public IActionResult Profile()
    {
        var firstName = HttpContext.Session.GetString("Name");
        var lastName = HttpContext.Session.GetString("LastName");
        if (firstName == null)
        {
            return Unauthorized();
        }

        return Ok(new
        {
            FirstName = firstName,
            LastName = lastName,
            });
    }
}