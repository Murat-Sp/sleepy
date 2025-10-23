using Microsoft.Extensions.FileProviders;
var builder = WebApplication.CreateBuilder(args);

// --- Сервіси ---
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<AdditionalInfoService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

var app = builder.Build();
// var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

// // якщо папки ще нема — створюємо
// if (!Directory.Exists(uploadsPath))
// {
//     Directory.CreateDirectory(uploadsPath);
// }

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(uploadsPath),
//     RequestPath = "wwwroot/uploads"
// });

// --- Middleware ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();          
app.UseCors("AllowReact"); 
app.UseSession();          
app.UseAuthorization();    
app.MapControllers();   
app.Run();
