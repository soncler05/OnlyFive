using IdentityServer4.Models;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using OnlyFive.BusinessInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OnlyFive.ExternalProviders
{
    public class DelegationGrantValidator<TUser> : IExtensionGrantValidator where TUser : IdentityUser, new()
    {
        private readonly ITokenValidator _validator;
        private readonly IFacebookAuthProvider _facebookAuthProvider;
        private readonly IGoogleAuthProvider _googleAuthProvider;
        private readonly Dictionary<ExtrenalProviderEnum, IExternalAuthProvider> _providers;
        private UserManager<TUser> _userManager;
        private readonly INonEmailUserProcessor _nonEmailUserProcessor;
        private readonly IEmailUserProcessor _emailUserProcessor;

        public DelegationGrantValidator(
            UserManager<TUser> userManager,
            ITokenValidator validator,
            IFacebookAuthProvider facebookAuthProvider, IGoogleAuthProvider googleAuthProvider,
            IAccountManagerBusiness accountManager,
            INonEmailUserProcessor nonEmailUserProcessor,
            IEmailUserProcessor emailUserProcessor
            )
        {
            _validator = validator;
            _facebookAuthProvider = facebookAuthProvider;
            _googleAuthProvider = googleAuthProvider;
            _providers = new Dictionary<ExtrenalProviderEnum, IExternalAuthProvider>();
            _providers.Add(ExtrenalProviderEnum.Facebook, _facebookAuthProvider);
            _providers.Add(ExtrenalProviderEnum.Google, _googleAuthProvider);
            _userManager = userManager;
            _nonEmailUserProcessor = nonEmailUserProcessor;
            _emailUserProcessor = emailUserProcessor;
            //providers.Add(ExtrenalProviderEnum.Twitter, _twitterAuthProvider);
            //providers.Add(ProviderType.LinkedIn, _linkedAuthProvider);
            //providers.Add(ProviderType.MyCustomProvider, _myCustomProvider);
        }

        public string GrantType => "external";

        public async Task ValidateAsync(ExtensionGrantValidationContext context)
        {
            var provider = context.Request.Raw.Get("provider");
            if (string.IsNullOrWhiteSpace(provider))
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidRequest, "invalid provider");
                return;
            }


            var token = context.Request.Raw.Get("token");
            if (string.IsNullOrWhiteSpace(token))
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidRequest, "invalid external token");
                return;
            }

            //var requestEmail = context.Request.Raw.Get("email");

            var providerType = (ExtrenalProviderEnum)Enum.Parse(typeof(ExtrenalProviderEnum), provider, true);

            if (!Enum.IsDefined(typeof(ExtrenalProviderEnum), providerType))
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidRequest, "invalid provider");
                return;
            }

            var userInfo = _providers[providerType].GetUserInfo(token);

            if (userInfo == null)
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidRequest, "couldn't retrieve user info from specified provider, please make sure that access token is not expired.");
                return;
            }

            var externalId = userInfo.Value<string>("id");
            if (!string.IsNullOrWhiteSpace(externalId))
            {

                var user = await _userManager.FindByLoginAsync(provider, externalId);
                if (null != user)
                {
                    user = await _userManager.FindByIdAsync(user.Id);
                    var userClaims = await _userManager.GetClaimsAsync(user);
                    context.Result = new GrantValidationResult(user.Id, provider, userClaims, provider, null);
                    return;
                }
            }

            var requestEmail = GetEmail(provider, userInfo);
            if (!string.IsNullOrWhiteSpace(requestEmail))
            {
                var user = await _userManager.FindByEmailAsync(requestEmail);
                if (null != user)
                {
                    user = await _userManager.FindByIdAsync(user.Id);
                    var userClaims = await _userManager.GetClaimsAsync(user);
                    context.Result = new GrantValidationResult(user.Id, provider, userClaims, provider, null);
                    return;
                }
            }
            else
            {
                context.Result = await _nonEmailUserProcessor.ProcessAsync(userInfo, provider);
                return;
            }

            context.Result = await _emailUserProcessor.ProcessAsync(userInfo, requestEmail, provider);
            return;
        }

        private string GetEmail(string provider, JObject userInfo)
        {
            return userInfo.Value<string>(provider.ToLower() == "linkedin" ? "emailAddress" : "email");

        }
    }

}
