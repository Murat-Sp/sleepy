using Microsoft.EntityFrameworkCore;

namespace Myapi   // <- має збігатися з твоїм проектом
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
         public DbSet<AdditionalInformation> AdditionalInformation { get; set; }
    }
}
