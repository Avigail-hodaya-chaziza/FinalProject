//using Server.webApi.Middlewares;
//using Bl;
//using Dal.Models;

//var builder = WebApplication.CreateBuilder(args);
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//var app = builder.Build();
//builder.Services.AddScoped<CustomerBl>();
//builder.Services.AddScoped<TreatmentBl>();
//builder.Services.AddScoped<BlockedSlotBl>();
//builder.Services.AddScoped<Appointment>();
//builder.Logging.ClearProviders(); // אם רוצים לנקות קודם
//builder.Logging.AddConsole(); // מוסיף לוגים לקונסול
//builder.Logging.AddDebug(); // מוסיף לוגים ל-Visual Studio output

//// הפעלת Swagger במצב פיתוח
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseMiddleware<ErrorHandlingMiddleware>();
//app.Logger.LogInformation("Starting application...");

//app.MapGet("/", () => "Hello World!");

//app.MapControllers(); // ודאי שיש שורה זו


//app.Run();

using Server.webApi.Middlewares;
using Bl;
using Dal.Models;
using Dal.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

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


var app = builder.Build();

//// הוספת נתוני דמה לדאטה בייס
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;
//    var context = services.GetRequiredService<dbClass>();
//    context.SeedData(); // קריאה לפונקציה המוסיפה נתוני דמה
//}

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
app.Run();
