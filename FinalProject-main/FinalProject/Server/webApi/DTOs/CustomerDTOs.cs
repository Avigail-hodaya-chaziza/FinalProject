using System.ComponentModel.DataAnnotations;

namespace Server.webApi.DTOs
{
    public class CustomerDto
    {
        [Range(9, int.MaxValue, ErrorMessage = "CustomerId must be 9 number.")]
        public int CustomerId { get; set; }
        
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        [Required]
        public string PhoneNumber { get; set; }

        [EmailAddress]
        public string Email { get; set; }
    }

}
