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
        List<Customer> GetAllCustomers();
        void UpdateCustomer(int customerId, string fullName, string phoneNumber, string email);
        void ContactCustomer(int customerId);
        List<Customer> GetUncontactedCustomers();
        Customer? GetCustomerById(int customerId);
        void AddCustomer(Customer customer);
        bool ExistsByName(string name);
        Customer FindByNameAndEmail(string name, string email);
    }
}