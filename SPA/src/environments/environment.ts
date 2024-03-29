// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: "https://localhost:44320/api", // Change this to the address of your backend API if different from frontend address
  tokenUrl: "https://localhost:44320", // For IdentityServer/Authorization Server API. You can set to null if same as baseUrl
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
