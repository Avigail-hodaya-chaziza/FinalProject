// DAL - אחראית לגישה לנתונים בלבד
using Dal.Api;
using Dal.Models;



public class CustomerService : ICustomer
{
    private readonly dbClass _dbContext;

    public CustomerService(dbClass dbContext) => _dbContext = dbContext;

    public List<Customer> GetAllCustomers()
    {
        var customers = _dbContext.Customers
            .Select(c => new Customer
            {
                CustomerId = c.CustomerId,
                FirstName = c.FirstName,
                LastName = c.LastName,
                PhoneNumber = c.PhoneNumber,
                Email = c.Email,
            })
            .ToList();

        return customers;
    }

    public Customer? GetCustomerById(string customerId)
    {
        return _dbContext.Customers.FirstOrDefault(c => c.CustomerId == customerId);
    }

    public void AddCustomer(Customer customer)
    {
        _dbContext.Customers.Add(customer);
        _dbContext.SaveChanges();
    }


    public void UpdateCustomer(string customerId, string firstName, string lastName, string phoneNumber, string email)
    {
        var customer = _dbContext.Customers.FirstOrDefault(c => c.CustomerId == customerId);
        if (customer == null)
            throw new ArgumentException($"Customer with ID {customerId} does not exist.");

        customer.FirstName = firstName;
        customer.LastName = lastName;
        customer.PhoneNumber = phoneNumber;
        customer.Email = email;

        _dbContext.SaveChanges();
    }

    public void ContactCustomer(string customerId)
    {
        var customer = _dbContext.Customers.FirstOrDefault(c => c.CustomerId == customerId);
        if (customer == null)
            throw new ArgumentException($"Customer with ID {customerId} does not exist.");

        customer.IsContacted = true;
        _dbContext.SaveChanges();
    }

    public List<Customer> GetUncontactedCustomers()
    {
        List<Customer> customer = _dbContext.Customers.Where(c => !c.IsContacted).ToList();
        return customer;
    }

    public Customer FindByIdAndEmail(string customerId, string email)
    {
        return _dbContext.Customers.FirstOrDefault(c => c.CustomerId == customerId && c.Email == email);
    }

    public bool ExistsById(string customerId)
    {
        return _dbContext.Customers.Any(c => c.CustomerId == customerId);
    }
}
