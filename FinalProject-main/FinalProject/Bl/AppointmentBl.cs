using Dal.Models;
using Dal.Services;
using Serilog;
namespace Bl
{
    public class AppointmentBl
    {
        private readonly AppointmentService _appointmentService;
        private readonly CustomerService _customerService;
        private readonly BlockedSlotService _blockedSlotService;

        public AppointmentBl(AppointmentService appointmentService, CustomerService customerService, BlockedSlotService blockedSlotService)
        {
            Log.Logger = new LoggerConfiguration()
                .WriteTo.Console()
                .WriteTo.File("logs\\app.log")
                .CreateLogger();

            _appointmentService = appointmentService;
            _customerService = customerService;
            _blockedSlotService = blockedSlotService;
        }

        public bool AddAppointment(string customerId, DateOnly date, int treatment)
        {
            var existingCustomer = _customerService.GetCustomerById(customerId);
            if (existingCustomer == null)
            {
                //צריך לקשר בריאקט להוספת לקוח חדש
                Console.WriteLine("Customer not found, please register as a new customer");
            }

            if (treatment <= 0)
            {
                Log.Warning("Invalid treatment ID.");
                return false;
            }

            if (_appointmentService.IsDateTaken(date))
            {
                Log.Warning("The selected date is already taken.");
                return false;
            }

            //לבדוק אם צריך למנוע קביעת תור לשבוע הקרוב

            if (date <= DateOnly.FromDateTime(DateTime.Now.AddDays(7)))
            {
                Log.Warning("Cannot schedule an appointment within the next 7 days.");
                return false;
            }

            //בדיקה אם התאריך הוא תאריך עתידי
            if (date < DateOnly.FromDateTime(DateTime.Now))
            {
                Log.Warning("Cannot schedule in the past.");
                return false;
            }

            //בדיקה אם התאריך חסום
            if (_blockedSlotService.IsDateBlocked(date))
            {
                Log.Warning("The selected date is blocked.");
                return false;
            }

            var appointment = new Appointment
            {
                CustomerId = customerId,
                TreatmentId = treatment,
                ScheduledTime = date,
                Status = "Scheduled" // ערך ברירת מחדל
            };

            _appointmentService.AddAppointment(appointment);
            
            // חסימת התאריך אוטומטית
            try
            {
                var blockedSlot = new BlockedSlot
                {
                    Date = date,
                    HolidayName = "תאריך תפוס - תור קבוע",
                    Year = date.Year,
                    IsHoliday = false,
                    CountryCode = "IL"
                };
                _blockedSlotService.AddBlockedSlot(blockedSlot);
                Log.Information($"Date {date} automatically blocked after appointment booking.");
            }
            catch (Exception ex)
            {
                Log.Warning($"Failed to block date {date}: {ex.Message}");
                // לא נכשיל את התור אם החסימה נכשלה
            }
            
            Log.Information($"Appointment scheduled for {date}.");
            return true;
        }

        public List<DateOnly> GetAvailableDates()
        {
            var allDates = Enumerable.Range(0, 30)
                .Select(i => DateOnly.FromDateTime(DateTime.Now.AddDays(i)))
                .ToList();

            var blocked = _blockedSlotService.GetAllBlockedDates();
            var taken = _appointmentService.GetTakenDates();

            return allDates.Except(blocked).Except(taken).ToList();
        }

        public bool DeleteAppointment(DateOnly date)
        {
            var appt = _appointmentService.GetAppointmentByDate(date);
            if (appt == null)
            {
                Log.Warning("No appointment found.");
                return false;
            }

            if (date < DateOnly.FromDateTime(DateTime.Now))
            {
                Log.Warning("Cannot delete past appointments.");
                return false;
            }

            if (date <= DateOnly.FromDateTime(DateTime.Now.AddDays(7)))
            {
                Log.Warning("Cannot delete appointments within 7 days.");
                return false;
            }

            if (appt.Status == "Completed")
            {
                Log.Warning("No appointment found for date: {Date}", date);
                return false;
            }

            _appointmentService.DeleteAppointment(appt);
            Log.Information("Appointment deleted.");
            return true;
        }

        public bool UpdateAppointment(string customerId, DateOnly date, int treatment)
        {
            var appt = _appointmentService.GetAppointmentByDate(date);
            if (appt == null)
            {
                Log.Warning("No appointment found.");
                return false;
            }

            if (date < DateOnly.FromDateTime(DateTime.Now))
            {
                Log.Warning("Cannot update past appointments.");
                return false;
            }

            if (date <= DateOnly.FromDateTime(DateTime.Now.AddDays(2)))
            {
                Log.Warning("Cannot update appointments within 2 days.");
                return false;
            }

            DeleteAppointment(date);
            AddAppointment(customerId, date, treatment);
            Log.Information("Appointment updated for date {Date}", date);
            return true;
        }

        public bool DeleteAppointmentsBeforeCurrentYear()
        {
            int year = DateTime.Now.Year;
            var oldAppointments = _appointmentService.GetAppointmentsBeforeYear(year);

            if (!oldAppointments.Any())
            {
                Log.Information("No old appointments found.");
                return false;
            }

            _appointmentService.DeleteAppointments(oldAppointments);
            Log.Information("Deleted {Count} old appointments.", oldAppointments.Count);
            return true;
        }

        public List<Appointment> GetAppointmentsByCustomerId(string customerId)
        {
            return _appointmentService.GetAppointmentsByCustomerId(customerId);
        }

        public List<Appointment> GetAppointmentsInRange(DateOnly startDate, DateOnly endDate)
        {
            return _appointmentService.GetAppointmentsInRange(startDate, endDate);
        }

        public List<Appointment> GetUpcomingAppointments()
        {
            return _appointmentService.GetUpcomingAppointments();
        }

        public List<Appointment> GetAllAppointments()
        {
            return _appointmentService.GetAllAppointments();
        }




    }
}
