using System;
using System.Collections.Generic;

namespace Dal.Models;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public int CustomerId { get; set; }

    public int TreatmentId { get; set; }

    public DateOnly ScheduledTime { get; set; }

    public string Status { get; set; } = null!;

    public virtual Customer Customer { get; set; } = null!;

    public virtual Treatment Treatment { get; set; } = null!;
    public Appointment()
    { }
    //public Appointment(int appointmentId, int customerId, int treatmentId, DateOnly scheduledTime, string status, Customer customer, Treatment treatment)
    //{
    //    AppointmentId = appointmentId;
    //    CustomerId = customerId;
    //    TreatmentId = treatmentId;
    //    ScheduledTime = scheduledTime;
    //    Status = status;
    //    Customer = customer;
    //    Treatment = treatment;
    //}
    public Appointment(int customerId, int treatmentId, DateOnly scheduledTime)
    {
        CustomerId = customerId;
        TreatmentId = treatmentId;
        ScheduledTime = scheduledTime;
    }
}
