using System.ComponentModel.DataAnnotations;

namespace Server.webApi.DTOs
{
    public class TreatmentDTOs
    {
        [Required]
        public string TreatmentName { get; set; }
        
        [Required]
        public int TimeOfCare { get; set; }
       
        [Required]
        public decimal MinPrice { get; set; }
    }
}
