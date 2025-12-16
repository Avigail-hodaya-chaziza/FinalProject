using Dal.Models;
using Dal.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace Bl
{
    public class AdminLoginBl
    {
        private readonly AdminLoginService _adminLoginService;
        public AdminLoginBl(AdminLoginService adminLoginService)
        {
            _adminLoginService = adminLoginService;
        }
        public async Task<AdminLogin> ValidateAndAuthenticate(AdminLogin loginAttempt)
        {
            ValidateUsername(loginAttempt.Username);

            ValidatePassword(loginAttempt.Password);

            ValidateEmail(loginAttempt.email);

            ValidatePhoneNumber(loginAttempt.phoneNumber);

            var admin = await _adminLoginService.AuthenticateAdmin(loginAttempt);

            if (admin == null)
            {
                throw new UnauthorizedAccessException("name or password error");
            }

            return admin;
        }

        private void ValidateUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new ArgumentException("Username is a required field.");
            }
            if (username.Length < 3)
            {
                throw new ArgumentException("Username must be at least 3 characters long.");
            }
        }
        private void ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Password is a required field.");
            }

            if (password.Length < 6)
            {
                throw new ArgumentException("Password must be at least 6 characters long.");
            }


            string passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$";

            if (!Regex.IsMatch(password, passwordPattern))
            {
                string requirements = "The password must include: one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long..";
                throw new ArgumentException(requirements);
            }
        }

        private void ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("אימייל הוא שדה חובה.");
            }

            string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.IsMatch(email, emailPattern))
            {
                throw new ArgumentException("פורמט האימייל אינו תקין (נדרש מבנה כגון user@domain.com).");
            }
        }
        private void ValidatePhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                throw new ArgumentException("מספר טלפון הוא שדה חובה.");
            }

            string cleanNumber = Regex.Replace(phoneNumber, @"[^\d]", "");

            if (cleanNumber.Length < 9)
            {
                throw new ArgumentException("מספר הטלפון חייב לכלול 9 ספרות לפחות.");
            }

            if (!Regex.IsMatch(cleanNumber, @"^\d+$"))
            {
                throw new ArgumentException("מספר הטלפון יכול להכיל ספרות בלבד.");
            }
        }
    }
}

