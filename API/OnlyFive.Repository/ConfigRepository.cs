using Microsoft.EntityFrameworkCore;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.Models;
using System.Threading.Tasks;

namespace OnlyFive.Repository
{
    public class ConfigRepository : IConfigRepository
    {
        private readonly ApplicationDbContext _context;

        public ConfigRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<Config> FindOnGoing(string urlId)
        {
            return _context.Set<Config>().FirstOrDefaultAsync(c => c.Game.UrlId == urlId && c.Game.EndDate == null);
        }

        public async Task Update(Config entity)
        {
            _context.Set<Config>().Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}
