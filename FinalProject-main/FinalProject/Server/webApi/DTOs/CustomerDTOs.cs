using System.ComponentModel.DataAnnotations;

namespace Server.webApi.DTOs
{
    public class CustomerDto
    {
        public int CustomerId { get; set; }
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}