using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
namespace MyApi.Services;
using Myapi.Models;
using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;
using System.Text.Json;
[ApiController]
[Route("api/[controller]")]

public class UpdateInfoController : ControllerBase
{
    private readonly UserService _userService;

    public UpdateInfoController(UserService userService)
    {
        _userService = userService;
    }
    [HttpPut()]
public async Task<IActionResult> UpdateInfo([FromBody] UpgradeDto updateDto)
    {    
        var userJson = HttpContext.Session.GetString("UserData");
        if (userJson == null)
            return Unauthorized(new { message = "Користувача не знайдено" });
        var userData = JsonSerializer.Deserialize<Users>(userJson);
            //  var user = await _userService.GetByEmailAsync(userData.Id);
    // var user = await _userService.GetByIdAsync(id);
    // if (userData == null) return NotFound();

    if (!string.IsNullOrWhiteSpace(updateDto.NewName))
        userData.Name = updateDto.NewName;

    if (!string.IsNullOrWhiteSpace(updateDto.NewLastName))
        userData.LastName = updateDto.NewLastName;

    if (!string.IsNullOrWhiteSpace(updateDto.NewEmail))
        userData.Email = updateDto.NewEmail;

        if (!string.IsNullOrWhiteSpace(updateDto.NewPassword) && !string.IsNullOrEmpty(updateDto.RepeatPassword))
        {
            var passwordService = new PasswordService();
            var hashedPass = passwordService.HashPassword(updateDto.NewPassword);
            userData.Password = hashedPass;
        }
    await _userService.UpdateAsync(userData.Id,userData);
    return Ok(new{message = "Данні успішно оновлено",userData});

}

}