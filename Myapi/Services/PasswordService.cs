using Microsoft.AspNetCore.Identity;

namespace MyApi.Services
{
    public class PasswordService
    {
        private readonly PasswordHasher<object> _passwordHasher = new PasswordHasher<object>();
        public string HashPassword(string password)
        {
            return _passwordHasher.HashPassword(null, password);
        }

        public bool VerifyPassword(string hashedPassword, string enteredPassword)
        {
            var result = _passwordHasher.VerifyHashedPassword(null, hashedPassword, enteredPassword);
            return result == PasswordVerificationResult.Success;
        }
    }
}
