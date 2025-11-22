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


namespace MyApi.Services
{
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
            Console.WriteLine(HttpContext.Session.Id);

            return Ok(new { user, loggedIn = true });
        }

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

              
string htmlBody = $@"
<!DOCTYPE html>
<html lang='uk'>
<head>
  <meta charset='UTF-8'>
  <title>Відновлення паролю</title>
</head>
<body style='margin:0; padding:0; background:#1E1E1E; font-family:Arial, sans-serif; color:#e0e0e0;'>
  <div style='max-width:600px; margin:40px auto; background:#1E1E1E; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.6);'>
    <div style='background:#242424; padding:20px; text-align:center; border-bottom:1px solid #333;'>
      <h1 style='color:#4caf50; margin:0; font-size:26px; letter-spacing:1px;'>SleepyApp</h1>
    </div>
    <div style='padding:30px;'>
      <h2 style='color:#4caf50; text-align:center;'>Відновлення паролю</h2>
      <p style='font-size:16px; text-align:center; color:#ccc;'>
        Ви запросили відновлення паролю для вашого акаунту.
      </p>
      <p style='font-size:16px; text-align:center; margin-top:20px; color:#aaa;'>
        Ваш код підтвердження:
      </p>
      <div style='
        text-align:center;
        font-size:34px;
        font-weight:bold;
        color:#4caf50;
        letter-spacing: 3px;
        margin: 25px 0;
      '>{code}</div>
      <p style='text-align:center; color:#888; font-size:14px;'>
        Код дійсний протягом 1 хвилини.
      </p>
      <div style='text-align:center; margin-top:30px;'>
        <a href='http://localhost:3000/restore'
           style='
             display:inline-block;
             background:linear-gradient(135deg, #000000, #4caf50);
             color:#fff;
             padding:14px 28px;
             border-radius:10px;
             text-decoration:none;
             font-weight:bold;
             transition:0.3s;
           '>Відновити пароль</a>
      </div>
      <hr style='margin:40px 0; border:none; border-top:1px solid #333;' />
      <p style='font-size:12px; color:#666; text-align:center;'>
        Якщо ви не запитували відновлення паролю — просто ігноруйте цей лист.
      </p>
    </div>
  </div>
</body>
</html>";

              

                var mail = new MailMessage();
                mail.From = new MailAddress("sleepyapp3@gmail.com", "SleepyApp Support");
                mail.To.Add(restore.RestoreEmail);
                mail.Subject = "Відновлення паролю — SleepyApp";
                mail.Body = htmlBody;
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
                return StatusCode(500, "Не вдалося надіслати лист");
            }

            return Ok(new { message = "Код відправлено на пошту" });
        }

        [HttpPost("verify-code")]
        public async Task<IActionResult> Verify([FromBody] verifyDto verifyDto)
        {
            var user = await _userService.GetByEmailAsync(verifyDto.RestoreEmail);
            if (user == null) return NotFound("Користувача не знайдено");
            if (!user.RestoreExpires.HasValue) return BadRequest("Відправте код знову");

            DateTime expireTime = user.RestoreExpires.Value;
            DateTime now = DateTime.UtcNow;
            TimeSpan diff = now - expireTime;

            if (diff.TotalSeconds > 60)
            {
                user.RestoreCode = "";
                user.RestoreExpires = null;
                await _userService.UpdateAsync(user.Id, user);
                return BadRequest("Час дії коду минув");
            }

            if (verifyDto.RestoreCode != user.RestoreCode)
                return BadRequest("Невірний код");

            return Ok(new { message = "Код підтверджено" });
        }

        [HttpPost("new-password")]
        public async Task<IActionResult> ChangePassword([FromBody] RestorePasswordDto restorePassword)
        {
            var user = await _userService.GetByEmailAsync(restorePassword.RestoreEmail);
                 user.RestoreCode = "";
                user.RestoreExpires = null;
                await _userService.UpdateAsync(user.Id, user);
            if (user == null) return NotFound("Користувача не знайдено");

            user.RestoreCode = "";
            user.RestoreExpires = null;

            var passwordService = new PasswordService();
            string hashedPassword = passwordService.HashPassword(restorePassword.RestorePassword);
            user.Password = hashedPassword;

            await _userService.UpdateAsync(user.Id, user);
            return Ok(new { message = "Пароль змінено" });
        }
    }
}
