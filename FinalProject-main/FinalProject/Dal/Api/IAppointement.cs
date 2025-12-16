using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dal.Models;

namespace Dal.Api
{
    internal interface IAppointement
    {
        //bool AddAppointement(Customer customer, DateOnly date, Treatment treatment);
        //bool DeleteAppointement(DateOnly date);
        //void UpdateAppointement(Customer customer, DateOnly date, Treatment treatment);
        ////function to delete all appointments before the current year
        //void DeleteAppointmentsBeforeCurrentYear();
        //Customer? GetCustomerById(string customerId);
        //void AddCustomer(Customer customer);
        bool IsDateTaken(DateOnly date);
        //List<DateOnly> GetBlockedDates();
        List<DateOnly> GetTakenDates();
        void AddAppointment(Appointment appointment);
        Appointment? GetAppointmentByDate(DateOnly date);
        void DeleteAppointment(Appointment appointment);
        void DeleteAppointments(List<Appointment> appointments);
        List<Appointment> GetAppointmentsBeforeYear(int year);
        public List<Appointment> GetAppointmentsByCustomerId(int customerId);
        public List<Appointment> GetAppointmentsInRange(DateOnly startDate, DateOnly endDate);
        public List<Appointment> GetUpcomingAppointments();





    }
}
