using Bl;
using Dal.Models;
using Dal.Services;
using Microsoft.EntityFrameworkCore;
using Server.webApi.Middlewares;
using Microsoft.AspNetCore.Authentication.Cookies;


var builder = WebApplication.CreateBuilder(args);

// ����� CORS � ����� ������ ��� React
builder.Services.AddCors(options =>
{
    options.AddPolicy("Allow", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
         .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.ExpireTimeSpan = TimeSpan.FromHours(1);
    options.SlidingExpiration = true;
});
builder.Services.AddAuthorization();
builder.Services.AddDbContext<dbClass>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.CommandTimeout(120)));

builder.Services.AddScoped<CustomerBl>();
builder.Services.AddScoped<TreatmentBl>();
builder.Services.AddScoped<BlockedSlotBl>();
builder.Services.AddScoped<AppointmentBl>();
builder.Services.AddScoped<Appointment>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddScoped<AppointmentService>();
builder.Services.AddScoped<TreatmentService>();
builder.Services.AddScoped<BlockedSlotService>();

builder.Services.Configure<Roles>(
    builder.Configuration.GetSection("AdminCredentials"));

builder.Services.AddHttpClient<BlockedSlotBl>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("User-Agent", "AppointmentSystem/1.0");
});

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(System.Text.Unicode.UnicodeRanges.All);
    });

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<dbClass>();
    SeedData.Initialize(context);
    
    // טעינת תאריכים חסומים ברקע (לא חוסם את השרת)
    _ = Task.Run(async () =>
    {
        try
        {
            using var scope2 = app.Services.CreateScope();
            var context2 = scope2.ServiceProvider.GetRequiredService<dbClass>();
            var blockedSlotBl = scope2.ServiceProvider.GetRequiredService<BlockedSlotBl>();
            
            if (!context2.BlockedSlots.Any())
            {
                Console.WriteLine("טוען תאריכים חסומים מ-API חיצוני ברקע...");
                await blockedSlotBl.GetBlockedDatesFromApi();
                Console.WriteLine("סיים טעינת תאריכים חסומים!");
            }
            else
            {
                Console.WriteLine($"תאריכים חסומים כבר קיימים: {context2.BlockedSlots.Count()}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"שגיאה בטעינת תאריכים חסומים: {ex.Message}");
        }
    });
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ErrorHandlingMiddleware>();
app.Logger.LogInformation("Starting application...");
app.UseCors("Allow");

app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
