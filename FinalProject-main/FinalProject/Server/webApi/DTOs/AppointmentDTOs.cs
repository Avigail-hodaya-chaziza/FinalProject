using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Dal.Models;

namespace Server.webApi.DTOs
{
    public class AppointmentDTOs
    {
        [Required]
        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateOnly ScheduledTime { get; set; }

        [Required]
        public virtual int CustomerId { get; set; }

        [Required]
        //public virtual Treatment Treatment { get; set; }
        public int TreatmentId { get; set; }
    }
}
