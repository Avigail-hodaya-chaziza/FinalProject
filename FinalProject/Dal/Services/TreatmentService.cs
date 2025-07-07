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



using Dal.Api;
using Dal.Models;
using System;
using System.Collections.Generic;
using System.Linq;

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

    }
}
