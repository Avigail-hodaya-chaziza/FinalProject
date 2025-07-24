using System.ComponentModel.DataAnnotations;

namespace Server.webApi.DTOs
{
    public class TreatmentDTOs
    {
        public string? TreatmentName { get; set; }
        
        public int? TimeOfCare { get; set; }
       
        public decimal? MinPrice { get; set; }
    }
}
