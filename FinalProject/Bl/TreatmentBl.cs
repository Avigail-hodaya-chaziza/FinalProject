using Dal.Models;
using Dal.Services;

public class TreatmentBl
{
    private readonly TreatmentService _treatmentDal;

    public TreatmentBl(TreatmentService treatmentDal)
    {
        _treatmentDal = treatmentDal;
    }

    public void AddTreatment(string treatmentName, int timeOfCare, decimal minPrice)
    {
        if (string.IsNullOrWhiteSpace(treatmentName))
            throw new ArgumentException("Name cannot be null or empty");

        if (timeOfCare <= 0)
            throw new ArgumentException("Duration must be greater than zero");

        if (minPrice <= 0)
            throw new ArgumentException("Price must be greater than zero");

        Treatment newTreatment = new Treatment
        {
            TreatmentName = treatmentName,
            TimeOfCare = timeOfCare,
            MinPrice = minPrice
        };

        _treatmentDal.AddTreatmentToDb(newTreatment);
    }

    public void AddTreatmentByType(string treatmentName, string treatmentType)
    {
        var (minPrice, timeOfCare) = _treatmentDal.GetTreatmentDetails(treatmentType);

        AddTreatment(treatmentName, timeOfCare, minPrice);
    }
}
