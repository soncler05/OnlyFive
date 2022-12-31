using Microsoft.EntityFrameworkCore;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.Models;
using System.Linq;
using System.Threading.Tasks;

namespace OnlyFive.Repository
{
    public class GameRepository : IGameRepository
    {
        private readonly ApplicationDbContext _context;

        public GameRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Game> Create(Game entity)
        {
            _context.Add<Game>(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        public async Task<Game> Find(int id)
        {
            return await _context.Set<Game>()
                .Include(g => g.Config)
                .FirstOrDefaultAsync(e => e.Id == id);
        }
        public async Task<Game> FindWithRound(string gameUrlId, int rounDOffset)
        {
            return await _context.Set<Game>().Include(g => g.Rounds.Where(r => r.Offset == rounDOffset))
                .FirstOrDefaultAsync(g => g.UrlId == gameUrlId);
        }
        public async Task<Game> FindByUrlId(string urlId)
        {
            return await _context.Set<Game>()
                .Include(g => g.Host).Include(g => g.Guest)
                .Include(g => g.Config)
                .FirstOrDefaultAsync(e => e.UrlId == urlId);
        }
        public async Task Update(Game entity)
        {
            _context.Set<Game>().Update(entity);
            await _context.SaveChangesAsync();
        }
        public async Task Delete(int id)
        {
            var entity = await Find(id);
            _context.Set<Game>().Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
