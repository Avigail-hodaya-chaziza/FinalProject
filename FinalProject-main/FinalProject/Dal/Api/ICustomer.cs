using Dal.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Api
{
    internal interface ICustomer
    {
        //// פונקציה להוספת לקוח לתור
        //void AddCustomer(int CustomerId, string FirstName, string LastName, string PhoneNumber, string Email, bool IsContacted);
        //// פונקציה שבודקת אם יצרו קשר עם הלקןח
        //void ContactCustomer(int CustomerId);
        ////פונקציה לשינוי פרטי לקוח
        //void UpdateCustomer(int CustomerId, string FirstName, string LastName, string PhoneNumber, string Email);
        //// פונקציה שמראה את כל הלקוחות שקבעו תור ועדיין לא יצרו איתם קשר טלפוני
        //List<Customer> GetCustomer(int CustomerId);
         List<Customer> GetAllCustomers();
        void UpdateCustomer(int customerId, string firstName,
            string lastName, string phoneNumber, string email);

        void ContactCustomer(int customerId);

        List<Customer> GetUncontactedCustomers();

         Customer? GetCustomerById(int customerId);

         void AddCustomer(Customer customer);
        bool ExistsById(int customerId);
        Customer FindByIdAndEmail(int customerId, string email);

    }

}

