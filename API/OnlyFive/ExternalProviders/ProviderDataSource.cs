using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace OnlyFive.ExternalProviders
{
    public class ProviderDataSource
    {
        public static IEnumerable<Provider> GetProviders(IConfiguration configuration)
        {
            return new List<Provider>
            {
                new Provider
                {
                    ProviderId = 1,
                    Name = "Facebook",
                    UserInfoEndPoint = "https://graph.facebook.com/v2.8/me"
                },
                new Provider
                {
                    ProviderId = 2,
                    Name = "Google",
                    UserInfoEndPoint = "https://oauth2.googleapis.com/tokeninfo",
                    ClientId = configuration.GetSection("OpenIdConnect:Google:ClientId").Value
                },
                 new Provider
                {
                    ProviderId = 3,
                    Name = "Twitter",
                    UserInfoEndPoint = "https://api.twitter.com/1.1/account/verify_credentials.json"
                },
                 new Provider
                 {
                     ProviderId = 4,
                     Name="LinkedIn",
                     UserInfoEndPoint = "https://api.linkedin.com/v1/people/~:(id,email-address,first-name,last-name,location,industry,picture-url)?"
                 },
                 new Provider
                 {
                     ProviderId = 5,
                     Name = "GitHub",
                     UserInfoEndPoint = "https://api.github.com/user"
                 }
            };

            //return new List<Provider>
            //{
            //    new Provider
            //    {//https://graph.facebook.com/debug_token?input_token={0}&access_token={1}|{2}
            //        ProviderId = 1,
            //        Name = "Facebook",
            //        UserInfoEndPoint = $"https://graph.facebook.com/debug_token?input_token={0}&" +
            //        $"access_token={configuration.GetSection("OpenIdConnect:Facebook:ClientId").Value}|" +
            //        $"{configuration.GetSection("OpenIdConnect:Facebook:ClientSecret").Value}",//"https://graph.facebook.com/v2.8/me/?access_token={token}"
            //        ClientId = configuration.GetSection("OpenIdConnect:Facebook:ClientId").Value
            //    },
            //    new Provider
            //    {
            //        ProviderId = 2,
            //        Name = "Google",
            //        UserInfoEndPoint = "https://oauth2.googleapis.com/tokeninfo?id_token={0}", //"https://www.googleapis.com/oauth2/v2/userinfo"
            //        ClientId = configuration.GetSection("OpenIdConnect:Google:ClientId").Value
            //    },
            //     new Provider
            //    {
            //        ProviderId = 3,
            //        Name = "Twitter",
            //        UserInfoEndPoint = "https://api.twitter.com/1.1/account/verify_credentials.json"
            //    },
            //    //new Provider
            //    //{
            //    //    ProviderId = 4,
            //    //    Name="MyCustomProvider",
            //    //    UserInfoEndPoint = "[url to end point which validates the token and returns user data]"
            //    //}
            //};

        }
    }
}
