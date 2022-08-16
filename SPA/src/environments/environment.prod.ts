export const environment = {
  production: true,
  baseUrl: "", // Change this to the address of your backend API if different from frontend address
  tokenUrl: "", // For IdentityServer/Authorization Server API. You can set to null if same as baseUrl
  loginUrl: '/login',
  openIdConnect: {
    google: {
      name:"google",
      issuer:"https://accounts.google.com",
      clientId: '795536398021-pr0jruj56qdk6phcm1ed9jjbabthv0jb.apps.googleusercontent.com'
    },
    facebook: {
      name:"facebook",
      clientId: "326368018362079"
    }
  }
};
