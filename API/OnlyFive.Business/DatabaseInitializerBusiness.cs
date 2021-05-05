using OnlyFive.BusinessInterface;
using OnlyFive.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlyFive.Business
{
    public class DatabaseInitializerBusiness : IDatabaseInitializerBusiness
    {
        private readonly IDatabaseInitializerRepository _repository;

        public DatabaseInitializerBusiness(IDatabaseInitializerRepository repository)
        {
            _repository = repository;
        }
        public async Task SeedAsync()
        {
            try
            {
                await _repository.SeedAsync();
            }
            catch (Exception ex)
            {

                throw;
            }
        }
    }
}
