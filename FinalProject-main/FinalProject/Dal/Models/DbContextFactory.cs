//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Dal.Models
//{
//    internal class DbContextFactory
//    {
//    }
//}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Dal.Models
{
    public class DbContextFactory : IDesignTimeDbContextFactory<dbClass>
    {
        public dbClass CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<dbClass>();
            optionsBuilder.UseSqlServer(
                "Data Source=(LocalDB)\\MSSQLLocalDB;Initial Catalog=FinalProjectDB;Integrated Security=True;Connect Timeout=30");

            return new dbClass(optionsBuilder.Options);
        }
    }
}
