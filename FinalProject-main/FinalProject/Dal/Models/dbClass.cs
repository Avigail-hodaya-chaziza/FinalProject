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

    public dbClass(DbContextOptions<dbClass> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }
    public virtual DbSet<BlockedSlot> BlockedSlots { get; set; }
    public virtual DbSet<Customer> Customers { get; set; }
    public virtual DbSet<Treatment> Treatments { get; set; }
    public virtual DbSet<Review> Reviews { get; set; }

   protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BlockedSlot>()
            .Property(b => b.Date)
            .HasConversion(
                v => v.ToDateTime(TimeOnly.MinValue),
                v => DateOnly.FromDateTime(v));
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
