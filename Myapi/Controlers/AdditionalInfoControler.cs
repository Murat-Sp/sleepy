using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ZstdSharp.Unsafe;

[ApiController]
[Route("api/[controller]")]
public class AdditionalInfo : ControllerBase
{
    private readonly UserService _userService;
    private readonly AdditionalInfoService _additionalService;

    public AdditionalInfo(UserService userService, AdditionalInfoService additionalService)
    {
        _userService = userService;
        _additionalService = additionalService;
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> CreateAdditionalInfo(string id, [FromBody] AdditionalInformation additional)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound("Користувача не знайдено");
        additional.UserId = id;
        var createdInfo = await _additionalService.CreateAsync(additional);
        user.AdditionalInfoId = createdInfo.Id;

        await _userService.UpdateAsync(user.Id, user);
        var allInfo = await _additionalService.GetAllAsync();
        var infoByOneUser = new List<AdditionalInformation>();

        foreach (var i in allInfo)
        {
            if (i.UserId == user.Id)
            {
                infoByOneUser.Add(i);
            }
        }
        return Ok(new { message = "Інформацію збережено", additionalInfo = infoByOneUser });
    }
[HttpGet("allInfo/{id}")]
public async Task<IActionResult> GetAllInfo(string id)
    {   var user = await _userService.GetByIdAsync(id);
          var allInfo = await _additionalService.GetAllAsync();
        var infoByOneUser = new List<AdditionalInformation>();

        foreach (var i in allInfo)
        {
            if (i.UserId == user.Id)
            {
                infoByOneUser.Add(i);
            }
        }
        return Ok(infoByOneUser);
    }

}
