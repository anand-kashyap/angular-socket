// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  socketUrl: 'http://localhost:3000',
  baseUrl: 'http://localhost:3000',
  vapid: {
    publicKey: 'BMQ1_Pf4rKfR668iDD4trSMujq1hTBX4GhAkPhZ_CvWaZDY_ImMmMQ159g60w6XmbMt1X56MueyKxto3Kj9n1NU',
    privateKey: 'PGM0h7yUdmijC1DUHGFCGvxfFB9zeRf7TPdJT7DC5zc'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
