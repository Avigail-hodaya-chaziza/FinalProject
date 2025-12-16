using Dal.Api;
using Dal.Models;

namespace Dal.Services
{
    public class AppointmentService:IAppointement
    {
        private readonly dbClass _dbContext;

        public AppointmentService(dbClass dbContext)
        {
            _dbContext = dbContext;
        }
    
        public bool IsDateTaken(DateOnly date)
        {
            return _dbContext.Appointments.Any(a => a.ScheduledTime == date);


        }

        public List<DateOnly> GetTakenDates()
        {
            return _dbContext.Appointments
                .Select(a => a.ScheduledTime)
                .ToList();
        }

        public void AddAppointment(Appointment appointment)
        {
            _dbContext.Appointments.Add(appointment);
            _dbContext.SaveChanges();
        }

        public Appointment? GetAppointmentByDate(DateOnly date)
        {
            return _dbContext.Appointments
                .FirstOrDefault(a => a.ScheduledTime == date);
        }

        public void DeleteAppointment(Appointment appointment)
        {
            _dbContext.Appointments.Remove(appointment);
            _dbContext.SaveChanges();
        }

        //פונקציה שמוחקת רשימה של תורים בשביל למחוק את כל התורים של השנה הקודמת
        public void DeleteAppointments(List<Appointment> appointments)
        {
            _dbContext.Appointments.RemoveRange(appointments);
            _dbContext.SaveChanges();
        }

        public List<Appointment> GetAppointmentsBeforeYear(int year)
        {
            return _dbContext.Appointments
                .Where(a => a.ScheduledTime.Year < year)
                .ToList();
        }

        public List<Appointment> GetAppointmentsByCustomerId(int customerId)
        {
            return _dbContext.Appointments
                .Where(a => a.CustomerId == customerId)
                .ToList();
        }

        public List<Appointment> GetAppointmentsInRange(DateOnly startDate, DateOnly endDate)
        {
            return _dbContext.Appointments
                .Where(a => a.ScheduledTime >= startDate && a.ScheduledTime <= endDate)
                .ToList();
        }

        public List<Appointment> GetUpcomingAppointments()
        {
            return _dbContext.Appointments
                .Where(a => a.ScheduledTime > DateOnly.FromDateTime(DateTime.Now))
                .ToList();
        }

        public List<Appointment> GetAllAppointments()
        {
            return _dbContext.Appointments.ToList();
        }




    }

}
