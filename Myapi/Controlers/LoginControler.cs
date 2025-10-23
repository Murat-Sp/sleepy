using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using System.Runtime.ExceptionServices;
using Azure.Identity;
using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Net.Mail;
using System.Text.Json;
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
        HttpContext.Session.SetString("UserData", JsonSerializer.Serialize(user));
        // await HttpContext.Session.CommitAsync();
        Console.WriteLine(HttpContext.Session.Id);
        return Ok(new { user, loggedIn = true} );
    }
    [HttpGet("check")]
    // [HttpGet("user")]
    // public IActionResult Profile()
    // {
    //     var firstName = HttpContext.Session.GetString("Name");
    //     var lastName = HttpContext.Session.GetString("LastName");
    //     if (firstName == null)
    //     {
    //         return Unauthorized();
    //     }

    //     return Ok(new
    //     {
    //         FirstName = firstName,
    //         LastName = lastName,
    //     });
    // }
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Сесію завершено" });
    }
    [HttpPost("restore")]
    public async Task<IActionResult> Restore([FromBody] Restore restore)
    {
         var user = await _userService.GetByEmailAsync(restore.RestoreEmail);
        if (user == null)
            return NotFound("Користувача не знайдено");
        try
        {
            var random = new Random();
            int code = random.Next(100000, 999999);
            var mail = new MailMessage();
            mail.From = new MailAddress("sleepyapp3@gmail.com");
            mail.To.Add(restore.RestoreEmail);
            mail.Subject = "Код відновлення паролю";
            mail.Body = $"<h1>Відновлення паролю</h1>,<p>{code}</p>";
            mail.IsBodyHtml = true;
            using var smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.Credentials = new NetworkCredential("sleepyapp3@gmail.com","fslk phbs vrvh ecxb");
            smtp.EnableSsl = true;
            smtp.Send(mail);

            Console.WriteLine("Лист відправлено успішно!");
        }

        catch (Exception ex)
        {
            Console.WriteLine("Помилка при відправці: " + ex.Message);
        }
        
        return Ok(new{ message = "код відпрвленно"});
    }
}