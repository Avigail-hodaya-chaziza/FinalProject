using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dal.Models;
using Microsoft.EntityFrameworkCore;

namespace Dal.Api
{
    internal interface ITreatment
    {




        //פונקציה להוספת טיפול
       //void AddTreatment(string TreatmentName, string Description, int Duration, decimal Price);
        void AddTreatmentToDb(Treatment newTreatment);
        public (decimal MinPrice, int TimeOfCare) GetTreatmentDetails(string treatmentType);

        public void UpdateTreatmentInDb(string treatmentName, decimal newMinPrice, int newTimeOfCare);


    }
}
