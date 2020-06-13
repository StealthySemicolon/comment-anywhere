using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class CommentAnywhereContext : DbContext {
        public CommentAnywhereContext (DbContextOptions<CommentAnywhereContext> options) : base (options) { }

        public DbSet<User> Users { get; set; }
    }
}