using System.ComponentModel.DataAnnotations;

namespace Server.webApi.DTOs
{
    public class CustomerDto
    {
        [Range(9, int.MaxValue, ErrorMessage = "CustomerId must be 9 number.")]
        public int Id { get; set; }
        
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
