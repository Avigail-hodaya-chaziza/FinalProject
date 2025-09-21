using System.ComponentModel.DataAnnotations;

namespace Server.webApi.DTOs
{
    public class CustomerDto
    {
        [NineDigitAttribute]
        public string customerId { get; set; }
        
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }

}
