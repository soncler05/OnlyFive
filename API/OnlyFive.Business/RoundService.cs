using AutoMapper;
using OnlyFive.BusinessInterface;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.DTOS;
using OnlyFive.Types.Models;
using System.Threading.Tasks;

namespace OnlyFive.Business
{
    public class RoundService : IRoundService
    {
        private readonly IRoundRepository _repository;
        private readonly IMapper _mapper;
        public RoundService(IRoundRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<RoundDTO> Create(RoundDTO entity)
        {
            var result = await _repository.Create(_mapper.Map<Round>(entity));
            return _mapper.Map<RoundDTO>(result);
        }
        public async Task Update(RoundDTO entity)
        {
            await _repository.Update(_mapper.Map<Round>(entity));
        }
    }
}
