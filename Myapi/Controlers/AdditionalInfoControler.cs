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

    [HttpPost()]
    public async Task<IActionResult> CreateAdditionalInfo([FromBody] AdditionalInformation additional)
    {
        var userJson = HttpContext.Session.GetString("UserData");
        if (userJson == null)
            return Unauthorized();
         var userData = JsonSerializer.Deserialize<Users>(userJson);
        additional.UserId = userData?.Id;
        var createdInfo = await _additionalService.CreateAsync(additional);
        userData.AdditionalInfoId = createdInfo.Id;

        await _userService.UpdateAsync(userData.Id, userData);
        var allInfo = await _additionalService.GetAllAsync();
        var infoByOneUser = new List<AdditionalInformation>();

        foreach (var i in allInfo)
        {
            if (i.UserId == userData.Id)
            {
                infoByOneUser.Add(i);
            }
        }
        return Ok(new { message = "Інформацію збережено", additionalInfo = infoByOneUser });
    }
    [HttpGet("allInfo")]
    public async Task<IActionResult> GetAllInfo()
    {
        var userJson = HttpContext.Session.GetString("UserData");
        if (userJson == null) 
        return Unauthorized();
        var userData = JsonSerializer.Deserialize<Users>(userJson);
          var allInfo = await _additionalService.GetAllAsync();
        var infoByOneUser = new List<AdditionalInformation>();

        foreach (var i in allInfo)
        {
            if (i.UserId == userData.Id)
            {
                infoByOneUser.Add(i);
            }
        }
        return Ok(infoByOneUser);
    }

}
