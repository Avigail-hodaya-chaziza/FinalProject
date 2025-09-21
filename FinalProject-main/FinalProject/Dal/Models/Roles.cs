using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Models
{
    public class Roles

    {
        public string Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.User;
        public Roles() { }
        public Roles(string id, string fullName, string email, string password, UserRole role)
        {
            Id = id;
            FullName = fullName;
            Email = email;
            Password = password;
            Role = role;
        }
    
    }
}

