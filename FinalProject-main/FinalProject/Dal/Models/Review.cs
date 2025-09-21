using System.ComponentModel.DataAnnotations;

namespace Dal.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string CustomerName { get; set; }
        
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [StringLength(1000)]
        public string? Comment { get; set; }
        
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        [StringLength(100)]
        public string? Email { get; set; }
    }
}