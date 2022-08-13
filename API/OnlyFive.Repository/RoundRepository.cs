using Microsoft.EntityFrameworkCore;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.Models;
using System.Threading.Tasks;

namespace OnlyFive.Repository
{
    public class RoundRepository : IRoundRepository
    {
        private readonly ApplicationDbContext _context;

        public RoundRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Round> Create(Round entity)
        {
            _context.Add<Round>(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        public async Task Update(Round entity)
        {
            _context.Set<Round>().Update(entity);
            await _context.SaveChangesAsync();
        }
        public async Task<Round> Find(int gameId, int offset)
        {
            return await _context.Set<Round>()
                .FirstOrDefaultAsync(r => r.GameId == gameId && r.Offset == offset);
        }
    }
}
