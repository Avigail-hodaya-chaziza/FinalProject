using Dal.Models;
using Dal.Services;

public class TreatmentBl
{
    private readonly TreatmentService _treatmentDal;

    public TreatmentBl(TreatmentService treatmentDal)
    {
        _treatmentDal = treatmentDal;
    }

    public void AddTreatment(string? treatmentName, string? description, int? timeOfCare, decimal? minPrice)
    {
        if (string.IsNullOrWhiteSpace(treatmentName))
            throw new ArgumentException("Name cannot be null or empty");

        if (timeOfCare <= 0)
            throw new ArgumentException("Duration must be greater than zero");

        if (minPrice <= 0)
            throw new ArgumentException("Price must be greater than zero");
        if (treatmentName == null || minPrice == null || timeOfCare == null)
            throw new ArgumentException(" Name or Price or duration cannot be null");
            
        Console.WriteLine($"Creating treatment with Hebrew text: {treatmentName}, {description}");
        
        Treatment newTreatment = new Treatment
        {
            TreatmentName = treatmentName,
            Description = description ?? "",
            TimeOfCare = (int)timeOfCare,
            MinPrice = (decimal)minPrice
        };

        _treatmentDal.AddTreatmentToDb(newTreatment);
    }

    public List<Treatment> GetAllTreatments()
    {
        return _treatmentDal.GetAllTreatments();
    }

    public void AddTreatmentByType(string treatmentName, string treatmentType)
    {
        var (minPrice, timeOfCare) = _treatmentDal.GetTreatmentDetails(treatmentType);

        AddTreatment(treatmentName, "", timeOfCare, minPrice);
    }

    public void UpdateTreatment(int treatmentId,string description, string? treatmentName, int? timeOfCare, decimal? minPrice)
    {
        _treatmentDal.UpdateTreatment(treatmentId, description, treatmentName, timeOfCare, minPrice);
    }

    public void DeleteTreatment(int treatmentId)
    {
        _treatmentDal.DeleteTreatment(treatmentId);
    }

}

