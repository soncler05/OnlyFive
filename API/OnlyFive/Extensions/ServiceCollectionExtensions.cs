using IdentityServer4.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using OnlyFive.ExternalProviders;
using OnlyFive.ExternalProviders.Procesors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace OnlyFive.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddServices<TUser>(this IServiceCollection services) where TUser : IdentityUser, new()
        {
            services.AddScoped<INonEmailUserProcessor, NonEmailUserProcessor<TUser>>();
            services.AddScoped<IEmailUserProcessor, EmailUserProcessor<TUser>>();
            services.AddScoped<IExtensionGrantValidator, DelegationGrantValidator<TUser>>();
            services.AddScoped<IResourceOwnerPasswordValidator, IdentityServerResourceOwnerPasswordValidator<TUser>>();
            services.AddSingleton<HttpClient>();
            return services;
        }
        public static IServiceCollection AddProviders<TUser>(this IServiceCollection services) where TUser : IdentityUser, new()
        {
            services.AddTransient<IFacebookAuthProvider, FacebookAuthProvider>();
            services.AddTransient<ITwitterAuthProvider, TwitterAuthProvider>();
            services.AddTransient<IGoogleAuthProvider, GoogleAuthProvider>();
            //services.AddTransient<ILinkedInAuthProvider, LinkedInAuthProvider<TUser>>();
            //services.AddTransient<IGitHubAuthProvider, GitHubAuthProvider<TUser>>();
            return services;
        }
    }
}
