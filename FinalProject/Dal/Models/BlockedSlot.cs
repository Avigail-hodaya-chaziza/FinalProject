using System;
using System.Collections.Generic;

namespace Dal.Models;

public partial class BlockedSlot
{
    public int Id { get; set; }

    public DateOnly Date { get; set; }

    public string HolidayName { get; set; } = null!;

    public string CountryCode { get; set; } = null!;

    public int Year { get; set; }

    public bool IsHoliday { get; set; }
    public BlockedSlot(){}   
    public BlockedSlot (int id, DateOnly date, string holidayName, /*string countryCode,*/ int year, bool isHoliday)
    {
        Id = id;
        Date = date;
        HolidayName = holidayName;
        //CountryCode = countryCode;
        Year = year;
        IsHoliday = isHoliday;
    }
}
