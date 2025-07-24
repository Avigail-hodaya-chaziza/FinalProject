using System;
using System.Collections.Generic;

namespace Dal.Models;

public partial class Treatment
{
    public int TreatmentId { get; set; }

    public string TreatmentName { get; set; } = null!;

    public int TimeOfCare { get; set; }

    public decimal MinPrice { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public Treatment()
    { }
    public Treatment(int treatmentId, string treatmentName, int timeOfCare, decimal minPrice, ICollection<Appointment> appointments)
    {
        TreatmentId = treatmentId;
        TreatmentName = treatmentName;
        TimeOfCare = timeOfCare;
        MinPrice = minPrice;
        Appointments = appointments;
    }
}
