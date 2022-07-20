using Microsoft.EntityFrameworkCore;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
            return await _context.Set<Game>().FirstOrDefaultAsync(e => e.Id == id);
        }
        public async Task<Game> FindByUrlId(string urlId)
        {
            return await _context.Set<Game>().Include(g => g.Host).Include(g => g.Guest).
                FirstOrDefaultAsync(e => e.UrlId == urlId);
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
    }
}
