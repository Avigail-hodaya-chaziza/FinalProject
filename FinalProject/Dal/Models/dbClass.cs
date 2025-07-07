//using System;
//using System.Collections.Generic;
//using Microsoft.EntityFrameworkCore;

//namespace Dal.Models;

//public partial class dbClass : DbContext
//{
//    public dbClass()
//    {
//    }

//    public dbClass(DbContextOptions<dbClass> options)
//        : base(options)
//    {
//    }

//    public virtual DbSet<Appointment> Appointments { get; set; }

//    public virtual DbSet<BlockedSlot> BlockedSlots { get; set; }

//    public virtual DbSet<Customer> Customers { get; set; }

//    public virtual DbSet<Treatment> Treatments { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Data Source=(LocalDB)\\MSSQLLocalDB;AttachDbFilename='C:\\Users\\THE USER\\Desktop\\project full stack\\FinalProject\\Dal\\Data\\database.mdf';Integrated Security=True;Connect Timeout=30");

//    protected override void OnModelCreating(ModelBuilder modelBuilder)
//    {
//        modelBuilder.Entity<Appointment>(entity =>
//        {
//            entity.HasKey(e => e.AppointmentId).HasName("PK__Appointm__8ECDFCA265E80F6C");

//            entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
//            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
//            entity.Property(e => e.Status)
//                .HasMaxLength(50)
//                .IsUnicode(false);
//            entity.Property(e => e.TreatmentId).HasColumnName("TreatmentID");

//            entity.HasOne(d => d.Customer).WithMany(p => p.Appointments)
//                .HasForeignKey(d => d.CustomerId)
//                .OnDelete(DeleteBehavior.ClientSetNull)
//                .HasConstraintName("FK__Appointme__Custo__634EBE90");

//            entity.HasOne(d => d.Treatment).WithMany(p => p.Appointments)
//                .HasForeignKey(d => d.TreatmentId)
//                .OnDelete(DeleteBehavior.ClientSetNull)
//                .HasConstraintName("FK__Appointme__Treat__6442E2C9");
//        });

//        modelBuilder.Entity<BlockedSlot>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__BlockedS__3214EC07091829E2");

//            entity.Property(e => e.CountryCode)
//                .HasMaxLength(2)
//                .IsUnicode(false)
//                .IsFixedLength();
//            entity.Property(e => e.HolidayName).HasMaxLength(100);
//        });

//        modelBuilder.Entity<Customer>(entity =>
//        {
//            entity.HasKey(e => e.CustomerId).HasName("PK__tmp_ms_x__A4AE64B8401790B3");

//            entity.Property(e => e.CustomerId)
//                .ValueGeneratedNever()
//                .HasColumnName("CustomerID");
//            entity.Property(e => e.Email)
//                .HasMaxLength(255)
//                .IsUnicode(false);
//            entity.Property(e => e.FirstName)
//                .HasMaxLength(100)
//                .IsUnicode(false);
//            entity.Property(e => e.LastName)
//                .HasMaxLength(100)
//                .IsUnicode(false);
//            entity.Property(e => e.PhoneNumber)
//                .HasMaxLength(15)
//                .IsUnicode(false);
//        });

//        modelBuilder.Entity<Treatment>(entity =>
//        {
//            entity.HasKey(e => e.TreatmentId).HasName("PK__Treatmen__1A57B711867C0C6E");

//            entity.Property(e => e.TreatmentId).HasColumnName("TreatmentID");
//            entity.Property(e => e.MinPrice).HasColumnType("decimal(10, 2)");
//            entity.Property(e => e.TreatmentName)
//                .HasMaxLength(100)
//                .IsUnicode(false);
//        });

//        OnModelCreatingPartial(modelBuilder);
//    }

//    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
//}

using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Dal.Models;

public partial class dbClass : DbContext
{
    // אין צורך ב-ctor ללא פרמטרים כאשר עובדים עם DI
    public dbClass(DbContextOptions<dbClass> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }
    public virtual DbSet<BlockedSlot> BlockedSlots { get; set; }
    public virtual DbSet<Customer> Customers { get; set; }
    public virtual DbSet<Treatment> Treatments { get; set; }

    // אין צורך ב-OnConfiguring כאשר משתמשים ב-DI, אלא אם רוצים לאפשר הרצה גם מחוץ ל-DI
    // אם משאירים, יש לבדוק אם כבר הוגדרו אפשרויות
    // מומלץ למחוק לגמרי:
    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // {
    //     if (!optionsBuilder.IsConfigured)
    //     {
    //         optionsBuilder.UseSqlServer("your-connection-string");
    //     }
    // }
    //public void SeedData()
    //{
    //    using (var context = new YourDbContext())
    //    {
    //        // בדוק אם יש לקוחות קיימים
    //        if (!context.Customers.Any())
    //        {
    //            // הוסף לקוחות חדשים
    //            context.Customers.AddRange(new List<Customer>
    //        {
    //            new Customer { FirstName = "John", LastName = "Doe", PhoneNumber = "1234567890", Email = "john.doe@example.com", IsContacted = false },
    //            new Customer { FirstName = "Jane", LastName = "Smith", PhoneNumber = "0987654321", Email = "jane.smith@example.com", IsContacted = true }
    //        });
    //        }

    //        // בדוק אם יש טיפולים קיימים
    //        if (!context.Treatments.Any())
    //        {
    //            // הוסף טיפולים חדשים
    //            context.Treatments.AddRange(new List<Treatment>
    //        {
    //            new Treatment { TreatmentName = "Massage", Duration = 60, Price = 100 },
    //            new Treatment { TreatmentName = "Facial", Duration = 45, Price = 80 }
    //        });
    //        }

    //        // בדוק אם יש פגישות קיימות
    //        if (!context.Appointments.Any())
    //        {
    //            // הוסף פגישות חדשות
    //            context.Appointments.AddRange(new List<Appointment>
    //        {
    //            new Appointment { CustomerId = 1, TreatmentId = 1, ScheduledTime = DateOnly.FromDateTime(DateTime.Now.AddDays(1)), Status = "Scheduled" },
    //            new Appointment { CustomerId = 2, TreatmentId = 2, ScheduledTime = DateOnly.FromDateTime(DateTime.Now.AddDays(2)), Status = "Scheduled" }
    //        });
    //        }

    //        // שמור את השינויים במסד הנתונים
    //        context.SaveChanges();
    //    }
    //}




    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.AppointmentId).HasName("PK__Appointm__8ECDFCA265E80F6C");

            entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TreatmentId).HasColumnName("TreatmentID");

            entity.HasOne(d => d.Customer).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Appointme__Custo__634EBE90");

            entity.HasOne(d => d.Treatment).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.TreatmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Appointme__Treat__6442E2C9");
        });

        modelBuilder.Entity<BlockedSlot>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BlockedS__3214EC07091829E2");

            entity.Property(e => e.CountryCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.HolidayName).HasMaxLength(100);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__tmp_ms_x__A4AE64B8401790B3");

            entity.Property(e => e.CustomerId)
                .ValueGeneratedNever()
                .HasColumnName("CustomerID");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(15)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Treatment>(entity =>
        {
            entity.HasKey(e => e.TreatmentId).HasName("PK__Treatmen__1A57B711867C0C6E");

            entity.Property(e => e.TreatmentId).HasColumnName("TreatmentID");
            entity.Property(e => e.MinPrice).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TreatmentName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
