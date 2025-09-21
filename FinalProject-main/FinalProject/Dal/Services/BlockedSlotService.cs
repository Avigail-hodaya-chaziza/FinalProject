
using Dal.Api;
using Dal.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Dal.Services
{
    public class BlockedSlotService : IBlockedSlot
    {
        private readonly dbClass _dbContext;

        // הזרקת dbClass דרך ה-constructor
        public BlockedSlotService(dbClass dbContext)
        {
            _dbContext = dbContext;
        }

        public bool IsDateBlocked(DateOnly date)
        {
            var result = _dbContext.BlockedSlots.Any(b => b.Date == date);
            Console.WriteLine($"Checking if date {date} is blocked: {result}");
            Console.WriteLine($"Existing dates in DB: {string.Join(", ", _dbContext.BlockedSlots.Select(b => b.Date).ToList())}");
            return result;
        }

        public void AddBlockedSlot(BlockedSlot slot)
        {
            try
            {
                Console.WriteLine($"Adding blocked slot for date: {slot.Date}");
                _dbContext.Database.ExecuteSqlRaw(
                    "INSERT INTO BlockedSlots (Date, HolidayName, Year, IsHoliday, CountryCode) VALUES ({0}, {1}, {2}, {3}, {4})",
                    slot.Date, slot.HolidayName, slot.Year, slot.IsHoliday, slot.CountryCode ?? "IL");
                Console.WriteLine($"Successfully blocked date: {slot.Date}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting slot: {ex.Message}");
                throw;
            }
        }

        public void SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        //public bool Exists(DateOnly date)
        //{
        //    return _dbContext.BlockedSlots.Any(b => b.Date == date);
        //}

        public List<DateOnly> GetAllBlockedDates()
        {
            return _dbContext.BlockedSlots.Select(b => b.Date).ToList();
        }

        public List<BlockedSlot> GetAllBlockedSlots()
        {
            return _dbContext.BlockedSlots.ToList();
        }

        public void RemoveBlockedSlot(BlockedSlot slot)
        {
            _dbContext.BlockedSlots.Remove(slot);
        }

        public void ClearAllBlockedSlots()
        {
            _dbContext.Database.ExecuteSqlRaw("DELETE FROM BlockedSlots");
        }

        public void FixCountryCodeColumn()
        {
            try
            {
                _dbContext.Database.ExecuteSqlRaw("ALTER TABLE BlockedSlots ALTER COLUMN CountryCode NVARCHAR(2) NULL");
                _dbContext.Database.ExecuteSqlRaw("UPDATE BlockedSlots SET CountryCode = 'IL' WHERE CountryCode IS NULL");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fixing CountryCode column: {ex.Message}");
            }
        }

        public void AddBlockedSlotDirectly(DateOnly date, string holidayName, int year)
        {
            try
            {
                _dbContext.Database.ExecuteSqlRaw(
                    "INSERT INTO BlockedSlots (Date, HolidayName, Year, IsHoliday, CountryCode) VALUES ({0}, {1}, {2}, {3}, {4})",
                    date, holidayName, year, true, "IL");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting directly: {ex.Message}");
            }
        }
    }
}