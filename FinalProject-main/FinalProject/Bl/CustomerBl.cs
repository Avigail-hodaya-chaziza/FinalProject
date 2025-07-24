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

        public void AddCustomer(int customerId, string firstName, string lastName, string phoneNumber, string email, bool isContacted)
        {
            // בדיקות תקינות
            if (string.IsNullOrWhiteSpace(firstName))
                throw new ArgumentException("Name cannot be empty");
            if (string.IsNullOrWhiteSpace(lastName))
                throw new ArgumentException("Last name cannot be empty");
            if (string.IsNullOrWhiteSpace(phoneNumber))
                throw new ArgumentException("Phone number cannot be empty");
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty");

            // יצירת לקוח חדש
            var newCustomer = new Customer(customerId, firstName, lastName, phoneNumber, email, isContacted);

            // שמירתו בדאטה (לפי ההקשר – אתה צריך פונקציה ב-DAL שמכניסה ל-DB אם תתבסס על זה בעתיד)
            Console.WriteLine($"Client {firstName} {lastName} has been added to the queue.");
            // הערה: אם אתה רוצה שה-Add באמת תכניס למסד נתונים – תצטרך להוסיף פונקציה כזו ל־DAL
            _customerDal.AddCustomer(newCustomer);
        }

        public void UpdateCustomer(int customerId, string firstName, string lastName, string phoneNumber, string email)
        {
            _customerDal.UpdateCustomer(customerId, firstName, lastName, phoneNumber, email);
            Console.WriteLine($"Customer {firstName} {lastName} has been updated.");
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
                Console.WriteLine($"ID: {c.CustomerId}, Name: {c.FirstName} {c.LastName}, Phone: {c.PhoneNumber}, Email: {c.Email}");
            }
            return customers;
        }

        public Customer FindByIdAndEmail(int customerId, string email)
        {
            return _customerDal.FindByIdAndEmail(customerId, email);
        }

        public bool ExistsById(int customerId)
        {
            return _customerDal.ExistsById(customerId);
        }

    }
}
