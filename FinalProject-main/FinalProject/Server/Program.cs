
using Server.webApi.Middlewares;
using Bl;
using Dal.Models;
using Dal.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // כתובת ה-React שלך
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// רישום DbContext עם Connection String מהקובץ appsettings.json
builder.Services.AddDbContext<dbClass>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// רישום כל השירותים ל-DI
builder.Services.AddScoped<CustomerBl>();
builder.Services.AddScoped<TreatmentBl>();
builder.Services.AddScoped<BlockedSlotBl>();
builder.Services.AddScoped<AppointmentBl>();
builder.Services.AddScoped<Appointment>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddScoped<AppointmentService>();
builder.Services.AddScoped<TreatmentService>();
builder.Services.AddScoped<BlockedSlotService>();


// רישום HttpClient (אם צריך)
builder.Services.AddHttpClient();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ErrorHandlingMiddleware>();
app.Logger.LogInformation("Starting application...");

app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});
app.MapControllers();


app.UseCors("AllowAll");
app.Run();
