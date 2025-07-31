using System;
using System.Collections.Generic;

namespace Dal.Models;

public partial class BlockedSlot
{
    public int Id { get; set; }

    public DateOnly Date { get; set; }

    public string HolidayName { get; set; } = null!;

    public string CountryCode { get; set; } 

    public int Year { get; set; }

    public bool IsHoliday { get; set; }
    public BlockedSlot() { }
    public BlockedSlot(DateOnly dateOnly, string holidayName, int year, bool IsHoliday)
    {
        Date = dateOnly;
        HolidayName = holidayName;
        Year = year;
        IsHoliday = true;
    }

}