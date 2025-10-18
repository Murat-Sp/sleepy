using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
[ApiController]
[Route("api/[controller]")]

public class UserPageController : ControllerBase
{
    private readonly UserService _userService;

    public UserPageController(UserService userService)
    {
        _userService = userService;
    }
    [HttpGet("{id}")]

    public async Task<IActionResult> GetUser(string id)
    {
         var userId = HttpContext.Session.GetString("UserEmail");

          if (userId == null)
        return Unauthorized(new { message = "Not logged in" });

        var user = await _userService.GetByEmailAsync(userId);
        if (user == null)
        return NotFound();

    return Ok(user);
    }
    [HttpPut("setPhoto/{id}")]
    public async Task<IActionResult> SetPhoto(string id, IFormFile photo)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "Користувача не знайдено" });

        if (photo == null || photo.Length == 0)
            return BadRequest(new { message = "Файл не передано" });
        string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);
        var fileName = $"{Guid.NewGuid()}_{photo.FileName}";
        var filePath = Path.Combine(folderPath, fileName);
        if (!string.IsNullOrEmpty(user.Photo))
        {
            var oldFilePath = Path.Combine(folderPath, user.Photo);
            if (System.IO.File.Exists(oldFilePath))
            { 
                    try
                {
                        // if (Path.GetFileName(oldFilePath) != "avatar.png"){
                        //       System.IO.File.Delete(oldFilePath);
                          if (user.Photo != "avatar.png"){
                              System.IO.File.Delete(oldFilePath);
                    }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Помилка при видаленні файлу: {ex.Message}");
                    }
            }
        }
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await photo.CopyToAsync(stream);
        }
        await _userService.UpdatePhotoAsync(id, fileName);

        // return Ok(new { message = "Фото оновлено успішно", photo = fileName });
        return Ok(new { message = "Фото оновлено успішно" });
    }
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> delete(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "Користувача не знайдено" });
        await _userService.DeleteAsync(id);
        return Ok("Акаунт видалено");
    }
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Ви вийшли з акаунту" });
    }
    [HttpGet("check-session")]
    public IActionResult CheckSession()
    {
    var user = HttpContext.Session.GetString("UserEmail");
    return Ok(new { UserEmail = user });
    }
}
