using Dal.Models;
using Microsoft.EntityFrameworkCore;

public static class SeedData
{
    public static void Initialize(dbClass context)
    {
        context.Database.EnsureCreated();

        if (context.Treatments.Any())
        {
            return; // DB has been seeded
        }

        var treatments = new Treatment[]
        {
            new Treatment
            {
                TreatmentName = "עיסוי רפואי",
                TimeOfCare = 60,
                MinPrice = 200.00m,
                Description = "עיסוי טיפולי לכאבי גב וצוואר"
            },
            new Treatment
            {
                TreatmentName = "טיפול פנים",
                TimeOfCare = 45,
                MinPrice = 150.00m,
                Description = "טיפול ניקוי עמוק לפנים"
            },
            new Treatment
            {
                TreatmentName = "מניקור",
                TimeOfCare = 30,
                MinPrice = 80.00m,
                Description = "טיפוח ציפורניים מקצועי"
            },
            new Treatment
            {
                TreatmentName = "פדיקור",
                TimeOfCare = 45,
                MinPrice = 100.00m,
                Description = "טיפוח כפות רגליים וציפורניים"
            }
        };

        Console.WriteLine("Adding Hebrew treatments to database...");
        foreach (var treatment in treatments)
        {
            Console.WriteLine($"Adding: {treatment.TreatmentName} - {treatment.Description}");
        }
        
        context.Treatments.AddRange(treatments);
        context.SaveChanges();
        
        Console.WriteLine("Treatments saved successfully!");
    }
}