using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using System.Runtime.ExceptionServices;
using Azure.Identity;
using Microsoft.AspNetCore.Identity;
using System;
using System.Net;
using System.Net.Mail;
using System.Text.Json;
using System.Data;
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
    // [HttpGet("check")]
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
            string code = random.Next(100000, 999999).ToString();
            user.RestoreCode = code;
            user.RestoreExpires = DateTime.UtcNow.AddMinutes(1);
            await _userService.UpdateAsync(user.Id, user);
            var mail = new MailMessage();
            mail.From = new MailAddress("sleepyapp3@gmail.com");
            mail.To.Add(restore.RestoreEmail);
            mail.Subject = "Код відновлення паролю";
            mail.Body = $"<h1>Відновлення паролю</h1><p>{code}</p>";
            mail.IsBodyHtml = true;
            using var smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.Credentials = new NetworkCredential("sleepyapp3@gmail.com", "fslk phbs vrvh ecxb");
            smtp.EnableSsl = true;
            smtp.Send(mail);

            Console.WriteLine("Лист відправлено успішно!");
        }

        catch (Exception ex)
        {
            Console.WriteLine("Помилка при відправці: " + ex.Message);
        }

        return Ok(new { message = "код відпрвленно" });
    }
    [HttpPost("verify-code")]
    public async Task<IActionResult> Verify([FromBody] verifyDto verifyDto)
    {
        var user = await _userService.GetByEmailAsync(verifyDto.RestoreEmail);
        if (user == null) return NotFound("Користувача не знайдено");
        if (!user.RestoreExpires.HasValue) return BadRequest("Данних про час не існує");
        DateTime CreateTime = user.RestoreExpires.Value;
        DateTime now = DateTime.UtcNow;
        TimeSpan diff = now - CreateTime;
        if (diff.TotalSeconds > 60) { 
             user.RestoreCode = "";
             user.RestoreExpires = null;
             await _userService.UpdateAsync(user.Id,user);
            return BadRequest("час дії коду минув"); }
        if (verifyDto.RestoreCode != user.RestoreCode) return BadRequest("Не вірний код");
            
        return Ok(new { message = "код підтверджено" });
    }
    [HttpPost("new-password")]
    public async Task<IActionResult> ChangePassword([FromBody]RestorePasswordDto restorePassword)
    {
        var user = await _userService.GetByEmailAsync(restorePassword.RestoreEmail);
        if (user == null) return NotFound("Користувача не знайдено");
         user.RestoreCode = "";
         user.RestoreExpires = null;
         var passwordService = new PasswordService();
        string hashedPassword = passwordService.HashPassword(restorePassword.RestorePassword);
        user.Password = hashedPassword;
        await _userService.UpdateAsync(user.Id,user);
        return Ok(new{message = "Пароль змінено"});
    }
}