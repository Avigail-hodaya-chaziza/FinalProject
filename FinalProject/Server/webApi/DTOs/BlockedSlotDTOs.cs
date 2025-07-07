using System.ComponentModel.DataAnnotations;

namespace Server.webApi.DTOs
{
    public class BlockedSlotDTOs
    {
        [Required]
        public DateOnly Date { get; set; }

        [Required]
        public string HolidayName { get; set; }

        [Required]
        public string CountryCode { get; set; } = null!;

        [Range(1900, 2100, ErrorMessage = "Year must be between 1900 and 2100.")]
        public int Year { get; set; }

        [RegularExpression(@"^[A-Za-z]{2}$", ErrorMessage = "Country code must be a 2-letter code.")]
        public bool IsHoliday { get; set; }
    }
}
