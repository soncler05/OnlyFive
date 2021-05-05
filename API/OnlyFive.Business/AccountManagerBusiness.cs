using OnlyFive.BusinessInterface;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlyFive.Business
{
    public class AccountManagerBusiness : IAccountManagerBusiness
    {
        private readonly IAccountManagerRepository _repository;

        public AccountManagerBusiness(IAccountManagerRepository repository)
        {
            _repository = repository;
        }
        public async Task<bool> CheckPasswordAsync(ApplicationUser user, string password)
        {
            try
            {
               return await _repository.CheckPasswordAsync(user, password);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> CreateRoleAsync(ApplicationRole role, IEnumerable<string> claims)
        {
            try
            {
                return await _repository.CreateRoleAsync(role, claims);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> CreateUserAsync(ApplicationUser user, IEnumerable<string> roles, string password)
        {
            try
            {
               return await _repository.CreateUserAsync(user, roles, password);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> DeleteRoleAsync(ApplicationRole role)
        {
            try
            {
               return await _repository.DeleteRoleAsync(role);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> DeleteRoleAsync(string roleName)
        {
            try
            {
                return await _repository.DeleteRoleAsync(roleName);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> DeleteUserAsync(ApplicationUser user)
        {
            try
            {
               return await _repository.DeleteUserAsync(user);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> DeleteUserAsync(string userId)
        {
            try
            {
                return await  _repository.DeleteUserAsync(userId);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<ApplicationRole> GetRoleByIdAsync(string roleId)
        {
            try
            {
               return await _repository.GetRoleByIdAsync(roleId);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<ApplicationRole> GetRoleByNameAsync(string roleName)
        {
            try
            {
               return await _repository.GetRoleByNameAsync(roleName);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<ApplicationRole> GetRoleLoadRelatedAsync(string roleName)
        {
            try
            {
                return await _repository.GetRoleLoadRelatedAsync(roleName);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<List<ApplicationRole>> GetRolesLoadRelatedAsync(int page, int pageSize)
        {
            try
            {
              return  await _repository.GetRolesLoadRelatedAsync(page, pageSize);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(ApplicationUser User, string[] Roles)?> GetUserAndRolesAsync(string userId)
        {
            try
            {
               return await _repository.GetUserAndRolesAsync(userId);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<ApplicationUser> GetUserByEmailAsync(string email)
        {
            try
            {
                return  await _repository.GetUserByEmailAsync(email);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<ApplicationUser> GetUserByIdAsync(string userId)
        {
            try
            {
                return await _repository.GetUserByIdAsync(userId);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<ApplicationUser> GetUserByUserNameAsync(string userName)
        {
            try
            {
                return await _repository.GetUserByUserNameAsync(userName);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<IList<string>> GetUserRolesAsync(ApplicationUser user)
        {
            try
            {
                return await _repository.GetUserRolesAsync(user);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<List<(ApplicationUser User, string[] Roles)>> GetUsersAndRolesAsync(int page, int pageSize)
        {
            try
            {
                return await  _repository.GetUsersAndRolesAsync(page, pageSize);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> ResetPasswordAsync(ApplicationUser user, string newPassword)
        {
            try
            {
               return await _repository.ResetPasswordAsync(user, newPassword);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<bool> TestCanDeleteRoleAsync(string roleId)
        {
            try
            {
               return await _repository.TestCanDeleteRoleAsync(roleId);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<bool> TestCanDeleteUserAsync(string userId)
        {
            try
            {
               return await _repository.TestCanDeleteUserAsync(userId);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> UpdatePasswordAsync(ApplicationUser user, string currentPassword, string newPassword)
        {
            try
            {
               return await _repository.UpdatePasswordAsync(user, currentPassword, newPassword);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> UpdateRoleAsync(ApplicationRole role, IEnumerable<string> claims)
        {
            try
            {
                return await _repository.UpdateRoleAsync(role, claims);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> UpdateUserAsync(ApplicationUser user)
        {
            try
            {
                return await _repository.UpdateUserAsync(user);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<(bool Succeeded, string[] Errors)> UpdateUserAsync(ApplicationUser user, IEnumerable<string> roles)
        {
            try
            {
                return await _repository.UpdateUserAsync(user, roles);
            }
            catch (Exception e)
            {
                throw;
            }
        }
    }
}
