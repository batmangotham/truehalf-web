// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrl: "http://truehalf.bravocodesolutions.com/" || location.origin,
  apiUrl: "api/v1/",
  imageUrl: "http://truehalf.bravocodesolutions.com/",
  dummyImg: "/assets/img/user-dummy.png",
  // Initialize Firebase
  firebase: {
    apiKey: "AIzaSyDBaGXzLQvem9Nsmv3V5SvZk9KEgSgfvRU",
    authDomain: "truehalf-64e2d.firebaseapp.com",
    databaseURL: "https://truehalf-64e2d.firebaseio.com",
    projectId: "truehalf-64e2d",
    storageBucket: "truehalf-64e2d.appspot.com",
    messagingSenderId: "75323236093"
  }
};
