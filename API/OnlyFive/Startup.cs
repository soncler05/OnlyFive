using IdentityServer4.AccessTokenValidation;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi.Models;
using OnlyFive.Business;
using OnlyFive.Business.Authorization;
using OnlyFive.BusinessInterface;
using OnlyFive.Extensions;
using OnlyFive.ExternalProviders;
using OnlyFive.Repository;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.Helpers;
using OnlyFive.Types.Models;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlyFive
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Log.Information("********************>ConfigureServices started");
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration["ConnectionStrings:DefaultConnection"], b => b.MigrationsAssembly("OnlyFive.Repository")));

            // add identity
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Configure Identity options and password complexity here
            services.Configure<IdentityOptions>(options =>
            {
                // User settings
                options.User.RequireUniqueEmail = true;

                //    //// Password settings
                //    //options.Password.RequireDigit = true;
                //    //options.Password.RequiredLength = 8;
                //    //options.Password.RequireNonAlphanumeric = false;
                //    //options.Password.RequireUppercase = true;
                //    //options.Password.RequireLowercase = false;

                //    //// Lockout settings
                //    //options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                //    //options.Lockout.MaxFailedAccessAttempts = 10;
            });


            // Adds IdentityServer.
            services.AddIdentityServer()
                // The AddDeveloperSigningCredential extension creates temporary key material for signing tokens.
                // This might be useful to get started, but needs to be replaced by some persistent key material for production scenarios.
                // See http://docs.identityserver.io/en/release/topics/crypto.html#refcrypto for more information.
                .AddDeveloperSigningCredential()
                .AddInMemoryPersistedGrants()
                .AddInMemoryApiScopes(IdentityServerConfig.GetApiScopes()) //scopes added here
                // To configure IdentityServer to use EntityFramework (EF) as the storage mechanism for configuration data (rather than using the in-memory implementations),
                // see https://identityserver4.readthedocs.io/en/release/quickstarts/8_entity_framework.html
                .AddInMemoryIdentityResources(IdentityServerConfig.GetIdentityResources())
                .AddInMemoryApiResources(IdentityServerConfig.GetApiResources())
                .AddInMemoryClients(IdentityServerConfig.GetClients())
                .AddAspNetIdentity<ApplicationUser>()
                .AddProfileService<ProfileService>();

            //services.AddOidcStateDataFormatterCache();

            var applicationUrl = Configuration["ApplicationUrl"].TrimEnd('/');
            string googleClientId = Configuration["OpenIdConnect:Google:ClientId"];
            string googleClientSecret = Configuration["OpenIdConnect:Google:ClientSecret"];
            string googleIssuer = Configuration["OpenIdConnect:Google:Issuer"];

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = applicationUrl;
                    options.SupportedTokens = SupportedTokens.Jwt;
                    options.RequireHttpsMetadata = false; // Note: Set to true in production
                    options.ApiName = IdentityServerConfig.ApiName;
                })

                //.AddOpenIdConnect(authenticationScheme: "Google", displayName: "Google",options =>
                //{
                //    options.Authority = googleIssuer;
                //    options.RequireHttpsMetadata = false; // Note: Set to true in production
                //    options.ClientId = googleClientId;
                //    options.ClientSecret = googleClientSecret;

                //    // Change the callback path to match the google app configuration
                //    options.CallbackPath = "/signin-google";

                //    //options.SupportedTokens = SupportedTokens.Jwt;
                //    //options.ApiName = IdentityServerConfig.ApiName;
                //})
                ;

            // Add cors
            services.AddCors();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = IdentityServerConfig.ApiFriendlyName, Version = "v1" });
                c.OperationFilter<AuthorizeCheckOperationFilter>();
                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        Password = new OpenApiOAuthFlow
                        {
                            TokenUrl = new Uri("/connect/token", UriKind.Relative),
                            Scopes = new Dictionary<string, string>()
                            {
                                { IdentityServerConfig.ApiName, IdentityServerConfig.ApiFriendlyName }
                            }
                        }
                    }
                });
            });

            services.AddAutoMapper(typeof(Startup));

            services.AddProviders<ApplicationUser>();
            services.AddServices<ApplicationUser>();
            //services.AddTransient<IExtensionGrantValidator, DelegationGrantValidator>();
            //services.AddTransient<IFacebookAuthProvider, FacebookAuthProvider>();
            //services.AddTransient<IGoogleAuthProvider, GoogleAuthProvider>();
            //services.AddTransient<ITwitterAuthProvider, TwitterAuthProvider>();
            //services.AddTransient<IMyCustomProvider, MyCustomProvider>();

            //services.AddScoped<IAccountManager, AccountManager>();

            services.AddScoped<IDatabaseInitializerRepository, DatabaseInitializerRepository>();
            services.AddScoped<IDatabaseInitializerBusiness, DatabaseInitializerBusiness>();

            services.AddTransient<IAccountManagerRepository, AccountManagerRepository > ();
            services.AddTransient<IAccountManagerBusiness, AccountManagerBusiness> ();

            services.AddTransient<IGameRepository, GameRepository>();
            services.AddTransient<IGameService, GameService>();
            services.AddTransient<IRoundRepository, RoundRepository>();
            services.AddTransient<IRoundService, RoundService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            Utilities.ConfigureLogger(loggerFactory);
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "OnlyFive v1"));
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            
            if (env.IsDevelopment())
                app.UseCors(builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod());
            else
                app.UseCors(builder => builder
                    .WithOrigins(Configuration.GetSection("AllowedOrigins").Get<string[]>())
                    .AllowAnyHeader()
                    .AllowAnyMethod());

            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseAuthentication();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            //if (env.IsDevelopment())
            //{
            //    IdentityModelEventSource.ShowPII = true;
            //}
        }
    }
}
