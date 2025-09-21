using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dal.Models;


namespace Dal.Api
{
    internal interface IBlockedSlot
    {
        //bool Availabledates(DateOnly date);
        bool IsDateBlocked(DateOnly date);
        void AddBlockedSlot(BlockedSlot slot);
        void RemoveBlockedSlot(BlockedSlot slot);
        void ClearAllBlockedSlots();
        void SaveChanges();
        //bool Exists(DateOnly date);
        List<DateOnly> GetAllBlockedDates();
    }
}
