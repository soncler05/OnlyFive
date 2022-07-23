// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using AutoMapper;
using Microsoft.AspNetCore.Identity;
using OnlyFive.Types.DTOS;
using OnlyFive.Types.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExampleAngularCore.ViewModels
{
    public class AutoMapperProfile : Profile
    {

        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, UserViewModel>()
                   .ForMember(d => d.Roles, map => map.Ignore());
            CreateMap<UserViewModel, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<ApplicationUser, UserEditViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore());
            CreateMap<UserEditViewModel, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<ApplicationUser, UserPatchViewModel>()
                .ReverseMap();

            CreateMap<ApplicationUser, UserPatchViewModel>()
                .ReverseMap();

            CreateMap<ApplicationUser, ApplicationUserDTO>();

            CreateMap<Round, RoundDTO>()
                .ReverseMap();

            CreateMap<Game, GameDTO>()
                .ForMember(d => d.Host, map => map.MapFrom(o => o.Host))
                .ForMember(d => d.Guest, map => map.MapFrom(o => o.Guest))
                .ForMember(d => d.Rounds, map => map.MapFrom(o => o.Rounds));

            CreateMap<GameDTO, Game>()
                .ForMember(des => des.Host, src => src.Ignore())
                .ForMember(des => des.Guest, src => src.Ignore());

            //CreateMap<ApplicationRole, RoleViewModel>()
            //    .ForMember(d => d.Permissions, map => map.MapFrom(s => s.Claims))
            //    .ForMember(d => d.UsersCount, map => map.MapFrom(s => s.Users != null ? s.Users.Count : 0))
            //    .ReverseMap();
            //CreateMap<RoleViewModel, ApplicationRole>()
            //    .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            //CreateMap<IdentityRoleClaim<string>, ClaimViewModel>()
            //    .ForMember(d => d.Type, map => map.MapFrom(s => s.ClaimType))
            //    .ForMember(d => d.Value, map => map.MapFrom(s => s.ClaimValue))
            //    .ReverseMap();

            //CreateMap<ApplicationPermission, PermissionViewModel>()
            //    .ReverseMap();

            //CreateMap<IdentityRoleClaim<string>, PermissionViewModel>()
            //    .ConvertUsing(s => (PermissionViewModel)ApplicationPermissions.GetPermissionByValue(s.ClaimValue));

            //CreateMap<Customer, CustomerViewModel>()
            //    .ReverseMap();

            //CreateMap<Product, ProductViewModel>()
            //    .ReverseMap();

            //CreateMap<Order, OrderViewModel>()
            //    .ReverseMap();
        }
    }
}
