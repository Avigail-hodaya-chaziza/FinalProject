using System.ComponentModel.DataAnnotations;

namespace Server.webApi.DTOs
{
    public class AdminLoginDTOs
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string phoneNumber { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
