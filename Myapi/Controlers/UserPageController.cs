using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text.Json;
[ApiController]
[Route("api/[controller]")]

public class UserPageController : ControllerBase
{
    private readonly UserService _userService;

    public UserPageController(UserService userService)
    {
        _userService = userService;
    }
    [HttpGet("user")]

    public async Task<IActionResult> GetUser()
    {
        var userJson = HttpContext.Session.GetString("UserData");
        if (userJson == null)
        {
            return Unauthorized(new { message = "Not logged in" ,loggedIn = false});
        }
        var userData = JsonSerializer.Deserialize<Users>(userJson);
        Console.WriteLine(userData.Email);
        var user = await _userService.GetByEmailAsync(userData.Email);
        //  Console.WriteLine(user);
        if (user == null)
        return NotFound();

    return Ok(new { user,loggedIn = true});
    }
    [HttpPut("setPhoto")]
    public async Task<IActionResult> SetPhoto(IFormFile photo)
    {
        var userJson = HttpContext.Session.GetString("UserData");
        if (userJson == null)
            return NotFound(new { message = "Користувача не знайдено" , loggedIn = false });
        var userData = JsonSerializer.Deserialize<Users>(userJson);
            //  var user = await _userService.GetByEmailAsync(userData.Id);
        // Console.WriteLine(user);
           if (string.IsNullOrEmpty(userJson))
            return Unauthorized(new { message = "Користувач не увійшов" });
        if (photo == null || photo.Length == 0)
            return BadRequest(new { message = "Файл не передано" });
        string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);
        var fileName = $"{Guid.NewGuid()}_{photo.FileName}";
        var filePath = Path.Combine(folderPath, fileName);
        if (!string.IsNullOrEmpty(userData.Photo))
        {
            var oldFilePath = Path.Combine(folderPath, userData.Photo);
            if (System.IO.File.Exists(oldFilePath))
            {
                if (Path.GetFileName(oldFilePath) != "avatar.png") {

                    try
                    {
                         System.IO.File.Delete(oldFilePath);
                    }
                    catch (Exception ex)
                    {
                    Console.WriteLine($"Помилка при видаленні файлу: {ex.Message}");
                }
              }
            }
        }
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await photo.CopyToAsync(stream);
        }
        await _userService.UpdatePhotoAsync(userData.Id, fileName);

        // return Ok(new { message = "Фото оновлено успішно", photo = fileName });
        return Ok(new { message = "Фото оновлено успішно",userData, loggedIn = true});
    }
    [HttpDelete("delete")]
    public async Task<IActionResult> delete()
    {
        var userJson = HttpContext.Session.GetString("UserData");
        if (userJson == null)
            return NotFound(new { message = "Користувача не знайдено" });
        var userData = JsonSerializer.Deserialize<Users>(userJson);
             var user = await _userService.GetByEmailAsync(userData.Id);
        await _userService.DeleteAsync(user.Id);
            HttpContext.Session.Clear();
        return Ok("Акаунт видалено");
    }
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Ви вийшли з акаунту" });
    }
}
