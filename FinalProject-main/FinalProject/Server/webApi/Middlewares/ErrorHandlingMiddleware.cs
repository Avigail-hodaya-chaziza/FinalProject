namespace Server.webApi.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("🔥 שגיאה בשרת:");
                Console.WriteLine($"📌 הודעה: {ex.Message}");
                Console.WriteLine($"📍 סוג: {ex.GetType().Name}");
                Console.WriteLine($"📄 מיקום: {ex.StackTrace}");
                Console.ResetColor();

                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("{\"error\": \"שגיאה בשרת\"}");
            }

        }

        public class InvalidEmailForCustomerException : Exception
        {
            public InvalidEmailForCustomerException(int customerId)
                : base($"מספר הלקוח {customerId} קיים אך האימייל שגוי.")
            {
            }
        }
    }

}

