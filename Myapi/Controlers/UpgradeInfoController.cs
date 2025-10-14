using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
namespace MyApi.Services;
using Myapi.Models;
using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;
[ApiController]
[Route("api/[controller]")]

public class UpdateInfoController : ControllerBase
{
    private readonly UserService _userService;

    public UpdateInfoController(UserService userService)
    {
        _userService = userService;
    }
    [HttpPut("{id}")]
public async Task<IActionResult> UpdateInfo([FromBody] UpgradeDto updateDto, string id)
    {    
    var user = await _userService.GetByIdAsync(id);
    if (user == null) return NotFound();

    if (!string.IsNullOrWhiteSpace(updateDto.NewName))
        user.Name = updateDto.NewName;

    if (!string.IsNullOrWhiteSpace(updateDto.NewLastName))
        user.LastName = updateDto.NewLastName;

    if (!string.IsNullOrWhiteSpace(updateDto.NewEmail))
        user.Email = updateDto.NewEmail;

        if (!string.IsNullOrWhiteSpace(updateDto.NewPassword) && !string.IsNullOrEmpty(updateDto.RepeatPassword))
        {
            var passwordService = new PasswordService();
            var hashedPass = passwordService.HashPassword(updateDto.NewPassword);
            user.Password = hashedPass;
        }
    await _userService.UpdateAsync(id, user);
    return Ok("Дані оновлено успішно");

}

}