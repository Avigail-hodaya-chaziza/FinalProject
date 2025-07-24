//using Dal.Api;
//using Dal.Models;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;

//namespace Dal.Services
//{
//    public class BlockedSlotService : IBlockedSlot
//    {
//        private readonly dbClass _dbContext;

//        public BlockedSlotService()
//        {
//            _dbContext = new dbClass();
//        }

//        public bool IsDateBlocked(DateOnly date)
//        {
//            return _dbContext.BlockedSlots.Any(b => b.Date == date);
//        }

//        public void AddBlockedSlot(BlockedSlot slot)
//        {
//            _dbContext.BlockedSlots.Add(slot);
//        }

//        public void SaveChanges()
//        {
//            _dbContext.SaveChanges();
//        }

//        public bool Exists(DateOnly date)
//        {
//            return _dbContext.BlockedSlots.Any(b => b.Date == date);
//        }

//        public List<DateOnly> GetAllBlockedDates()
//        {
//            return _dbContext.BlockedSlots.Select(b => b.Date).ToList();
//        }
//    }
//}


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
            return _dbContext.BlockedSlots.Any(b => b.Date == date);
        }

        public void AddBlockedSlot(BlockedSlot slot)
        {
            _dbContext.BlockedSlots.Add(slot);
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
    }
}