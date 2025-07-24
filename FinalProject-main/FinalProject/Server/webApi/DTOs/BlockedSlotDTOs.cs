using System.ComponentModel.DataAnnotations;

namespace Server.webApi.DTOs
{
    public class BlockedSlotDTOs
    {
        [Required]
        public DateOnly Date { get; set; }

        [Required]
        [StringLength(100)]
        public string HolidayName { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^[A-Za-z]{2}$", ErrorMessage = "Country code must be a 2-letter code.")]
        public string CountryCode { get; set; } = "IL";

        [Range(1900, 2100, ErrorMessage = "Year must be between 1900 and 2100.")]
        public int Year { get; set; }

        public bool IsHoliday { get; set; }
    }
}
