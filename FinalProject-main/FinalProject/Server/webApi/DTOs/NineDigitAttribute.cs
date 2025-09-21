using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Server.webApi.DTOs
{
    public class NineDigitAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return ValidationResult.Success;
            }

            if (value is string idString)
            {
                // בדוק שהמחרוזת מכילה בדיוק 9 ספרות
                if (Regex.IsMatch(idString, @"^\d{9}$"))
                {
                    return ValidationResult.Success;
                }
            }

            // אם הערך אינו מחרוזת, או שאינו תואם את התבנית
            return new ValidationResult("Customer Id must be a 9-digit number.");
        }
    }
}