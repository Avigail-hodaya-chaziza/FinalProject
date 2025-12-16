using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Models
{
    public class AdminLogin
    {
        public int AdminId { get; set; }
        public string Username { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }
       public string Password { get; set; }
    }
}
