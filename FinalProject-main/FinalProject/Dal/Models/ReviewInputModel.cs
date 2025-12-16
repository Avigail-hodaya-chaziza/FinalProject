using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

public class ReviewInputModel
{
    [Required]
    [StringLength(255)]
    public string CustomerName { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [StringLength(1000)]
    public string? Comment { get; set; }

    [StringLength(100)]
    public string? Email { get; set; }

    // ⭐️ הקובץ הפיזי שנשלח מהטופס (לא נשמר ב-DB)
    public IFormFile? ImageFile { get; set; }
}