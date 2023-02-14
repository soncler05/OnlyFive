using Microsoft.EntityFrameworkCore;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlyFive.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDbContext _context;

        public CommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Comment> Add(Comment entity)
        {
            _context.Set<Comment>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }


        public async Task<IEnumerable<Comment>> GetList()
        {
            return await _context.Set<Comment>().ToListAsync();
        }

    }
}
