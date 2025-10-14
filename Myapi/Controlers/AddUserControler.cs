using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
namespace MyApi.Services;


[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }
  [HttpPost("create")]
public async Task<IActionResult> CreateUser([FromBody] Users user)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);
    var passwordService = new PasswordService();
    string hashedPassword = passwordService.HashPassword(user.Password);
    user.Password = hashedPassword;
    var created = await _userService.CreateAsync(user);

    return Ok(new { message = "✅ Дані збережено", user = created });
}

}
