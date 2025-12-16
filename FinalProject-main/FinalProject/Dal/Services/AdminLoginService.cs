using Dal.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore; // <-- Add this using directive
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Services
{
    public class AdminLoginService
    {
        private readonly dbClass _context;
        private readonly IConfiguration _configuration; // נדרש ל-JWT
        public AdminLoginService(dbClass context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<AdminLogin> AuthenticateAdmin(AdminLogin login)
        {
            var admin = await _context.AdminLogin
                .FirstOrDefaultAsync(a => a.Username == login.Username 
                    && a.Password == login.Password
                    && a.email == login.email
                    && a.phoneNumber == login.phoneNumber);
            return admin;
        }
    }
}
