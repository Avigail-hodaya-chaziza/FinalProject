using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Dal.Models;

public partial class dbClass : DbContext
{
    // ודא שיש כאן קונסטרקטור המקבל DbContextOptions
    public dbClass(DbContextOptions<dbClass> options)
        : base(options)
    {
    }

    // הוספת ה-DbSet החסרים שהבאת:
    public virtual DbSet<Appointment> Appointments { get; set; }
    public virtual DbSet<BlockedSlot> BlockedSlots { get; set; }
    public virtual DbSet<Customer> Customers { get; set; }
    public virtual DbSet<Treatment> Treatments { get; set; }
    public virtual DbSet<Review> Reviews { get; set; }
    public virtual DbSet<Roles> Roles { get; set; }
    public virtual DbSet<AdminLogin> AdminLogin { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // טיפול בהמרת DateOnly (כפי שהיה לך)
        modelBuilder.Entity<BlockedSlot>()
            .Property(b => b.Date)
            .HasConversion(
                v => v.ToDateTime(TimeOnly.MinValue),
                v => DateOnly.FromDateTime(v));

        // 🚨🚨🚨 תיקון קריטי לשגיאת ה-AdminLogin: כפיית מפתח ראשי 🚨🚨🚨
        modelBuilder.Entity<AdminLogin>(entity =>
        {
            // מאלץ את EF Core לזהות את AdminId כמפתח ראשי Identity.
            entity.HasKey(e => e.AdminId);

            // תיקון שמות העמודות ב-SQL Server עבור מאפיינים שנכתבו ב-camelCase
            entity.Property(e => e.email).HasColumnName("Email");
            entity.Property(e => e.phoneNumber).HasColumnName("PhoneNumber");
        });

        // 🚨🚨🚨 תיקון לטבלת Roles: כפיית מפתח ראשי 🚨🚨🚨
        modelBuilder.Entity<Roles>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

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
                .HasColumnName("CustomerID");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.FullName)
                .HasMaxLength(200)
                .IsUnicode(true)
                .HasColumnName("FirstName")
                .IsRequired(false);
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
                .IsUnicode(true);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}