using System;
using System.Collections.Generic;

namespace Dal.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string FullName { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string Email { get; set; } = null!;

    public bool IsContacted { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    
    public Customer()
    { }
    
    public Customer(string fullName, string phoneNumber, string email, bool isContacted = false)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        Email = email;
        IsContacted = isContacted;
    }
}
