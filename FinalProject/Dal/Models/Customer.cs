using System;
using System.Collections.Generic;

namespace Dal.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string Email { get; set; } = null!;

    public bool IsContacted { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public Customer()
    { }
    public Customer(int customerId, string firstName, string lastName, string phoneNumber, string email, bool isContacted)
    {
        CustomerId = customerId;
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        Email = email;
        IsContacted = isContacted;

    }
}
