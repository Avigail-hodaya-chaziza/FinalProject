//using Dal.Api;
//using Dal.Models;
//using System;
//using System.Collections.Generic;
//using System.Linq;

//namespace Dal.Services
//{
//    public class TreatmentService : ITreatment
//    {
//        public enum TreatmentType
//        {
//            Roots,
//            FullStraightening,
//            HeadFrame
//        }

//        //public void AddTreatmentToDb(Treatment newTreatment)
//        //{
//        //    try
//        //    {
//        //        using (var context = new dbClass())
//        //        {
//        //            context.Treatments.Add(newTreatment);
//        //            context.SaveChanges();
//        //        }
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        // לוג, טיפול, throw
//        //        throw new Exception("Database error: " + ex.Message, ex);
//        //    }
//        //}

//        //public (decimal MinPrice, int TimeOfCare) GetTreatmentDetails(string treatmentType)
//        //{
//        //    using (var context = new dbClass())
//        //    {
//        //        var treatment = context.Treatments
//        //            .FirstOrDefault(t => t.TreatmentName.Equals(treatmentType, StringComparison.OrdinalIgnoreCase));

//        //        if (treatment == null)
//        //            throw new ArgumentException("סוג טיפול לא מוכר.");

//        //        return (treatment.MinPrice, treatment.TimeOfCare);
//        //    }
//        //}
//        public void AddTreatmentToDb(Treatment newTreatment)
//        {
//            using (var context = new dbClass())
//            {
//                context.Treatments.Add(newTreatment);
//                context.SaveChanges();
//            }
//        }

//        public (decimal MinPrice, int TimeOfCare) GetTreatmentDetails(string treatmentType)
//        {
//            using (var context = new dbClass())
//            {
//                var treatment = context.Treatments
//                    .FirstOrDefault(t => t.TreatmentName.Equals(treatmentType, StringComparison.OrdinalIgnoreCase));

//                if (treatment == null)
//                    throw new ArgumentException("סוג טיפול לא מוכר.");

//                return (treatment.MinPrice, treatment.TimeOfCare);
//            }
//        }
//    }
//}



using System;
using System.Collections.Generic;
using System.Linq;
using Dal.Api;
using Dal.Models;
using Microsoft.EntityFrameworkCore;

namespace Dal.Services
{
    public class TreatmentService : ITreatment
    {
        private readonly dbClass _context;

        // הזרקת dbClass דרך ה-constructor
        public TreatmentService(dbClass context)
        {
            _context = context;
        }

        //מה הענין באינם הזה?? למה צריך אותו? ו
        public enum TreatmentType
        {
            Roots,
            FullStraightening,
            HeadFrame
        }

        public void AddTreatmentToDb(Treatment newTreatment)
        {
            _context.Treatments.Add(newTreatment);
            _context.SaveChanges();
        }

        public List<Treatment> GetAllTreatments()
        {
            var treatment = _context.Treatments
                .Select(t => new Treatment
                {
                    TreatmentId = t.TreatmentId,
                    TreatmentName = t.TreatmentName,
                    TimeOfCare = t.TimeOfCare,
                    MinPrice = t.MinPrice,
                    Appointments = t.Appointments
                })
                .ToList();

            return treatment;
        }

        //למה צריך את זה?
        public (decimal MinPrice, int TimeOfCare) GetTreatmentDetails(string treatmentType)
        {
            var treatment = _context.Treatments
                .FirstOrDefault(t => t.TreatmentName.Equals(treatmentType, StringComparison.OrdinalIgnoreCase));

            if (treatment == null)
                throw new ArgumentException("סוג טיפול לא מוכר.");

            return (treatment.MinPrice, treatment.TimeOfCare);
        }

        public void UpdateTreatmentInDb(string treatmentName, decimal newMinPrice, int newTimeOfCare)
        {
            var treatment = _context.Treatments
                .FirstOrDefault(t => t.TreatmentName.Equals(treatmentName, StringComparison.OrdinalIgnoreCase));

            if (treatment == null)
                throw new ArgumentException("סוג טיפול לא מוכר.");

            treatment.MinPrice = newMinPrice;
            treatment.TimeOfCare = newTimeOfCare;

            _context.SaveChanges();
        }

        //public void UpdateTreatment(int treatmentId, string treatmentName, int timeOfCare, decimal minPrice)
        //{
        //    var treatment = _context.Treatments.FirstOrDefault(t => t.TreatmentId == treatmentId);
        //    if (treatment == null)
        //        throw new ArgumentException("טיפול לא נמצא.");

        //    treatment.TreatmentName = treatmentName;
        //    treatment.TimeOfCare = timeOfCare;
        //    treatment.MinPrice = minPrice;

        //    _context.SaveChanges();
        //}


        public void UpdateTreatment(int treatmentId, string? treatmentName, int? timeOfCare, decimal? minPrice)
        {
            var treatment = _context.Treatments.FirstOrDefault(t => t.TreatmentId == treatmentId);
            if (treatment == null)
                throw new ArgumentException("טיפול לא נמצא.");

            if (treatmentName != null)
                treatment.TreatmentName = treatmentName;

            if (timeOfCare.HasValue)
                treatment.TimeOfCare = timeOfCare.Value;

            if (minPrice.HasValue)
                treatment.MinPrice = minPrice.Value;

            _context.SaveChanges();
        }

        public void DeleteTreatment(int treatmentId)
        {
            var treatment = _context.Treatments.FirstOrDefault(t => t.TreatmentId == treatmentId);
            if (treatment == null)
                throw new ArgumentException("טיפול לא נמצא.");
            _context.Treatments.Remove(treatment);
            _context.SaveChanges();

        }
    }
}

