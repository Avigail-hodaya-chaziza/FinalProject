using Dal.Api;
using Dal.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Bl
{
    public class CustomerBl
    {
        private readonly CustomerService _customerDal;

        public CustomerBl(CustomerService customerDal)
        {
            _customerDal = customerDal;
        }

        public List<Customer> GetAllCustomers()
        {
            return _customerDal.GetAllCustomers();
        }

        public void AddCustomer(string fullName, string phoneNumber, string email)
        {
            // בדיקות תקינות
            if (string.IsNullOrWhiteSpace(fullName))
                throw new ArgumentException("Name cannot be empty");
            if (string.IsNullOrWhiteSpace(phoneNumber))
                throw new ArgumentException("Phone number cannot be empty");
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty");

            // יצירת לקוח חדש
            var newCustomer = new Customer(fullName, phoneNumber, email);

            Console.WriteLine($"Client {fullName} has been added to the queue.");
            _customerDal.AddCustomer(newCustomer);
        }

        public void UpdateCustomer(int customerId, string fullName, string phoneNumber, string email)
        {
            _customerDal.UpdateCustomer(customerId, fullName, phoneNumber, email);
            Console.WriteLine($"Customer {fullName} has been updated.");
        }

        public void ContactCustomer(int customerId)
        {
            _customerDal.ContactCustomer(customerId);
            Console.WriteLine($"Customer with ID {customerId} has been contacted.");
        }

        public List<Customer> GetUncontactedCustomers()
        {
            var customers = _customerDal.GetUncontactedCustomers();
            foreach (var c in customers)
            {
                Console.WriteLine($"ID: {c.CustomerId}, Name: {c.FullName}, Phone: {c.PhoneNumber}, Email: {c.Email}");
            }
            return customers;
        }

        public Customer FindByNameAndEmail(string name, string email)
        {
            return _customerDal.FindByNameAndEmail(name, email);
        }

        public bool ExistsByName(string name)
        {
            return _customerDal.ExistsByName(name);
        }
    }
}