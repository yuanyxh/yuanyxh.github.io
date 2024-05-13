// import key from './data/service_account.json';
// import { getEnv, resolve } from './utils';

// import { existsSync, writeFileSync } from 'fs';
// import { request } from 'gaxios';
// import { google } from 'googleapis';

// process.env.http_proxy = 'http://127.0.0.1:7890'; /* Set proxy */
// process.env.HTTPS_PROXY = 'http://127.0.0.1:7890';

// const submitedPath = resolve('./helpers/data/submited.ts');

// const { VITE_DOMAIN_PATH } = getEnv();

// function getHref(path: string) {
//   return new URL(path, VITE_DOMAIN_PATH).href;
// }

// function writeSubmited(submitedList: string[]) {
//   try {
//     writeFileSync(
//       submitedPath,
//       `export default ${JSON.stringify(submitedList, null, 2)}`,
//       'utf-8'
//     );
//   } catch (err) {
//     console.log('write fail', err);
//   }
// }

// export function submit(routes: string[]) {
//   const jwtClient = new google.auth.JWT(
//     key.client_email,
//     void 0,
//     key.private_key,
//     ['https://www.googleapis.com/auth/indexing'],
//     void 0
//   );

//   jwtClient.authorize(async function (err, tokens) {
//     if (err) {
//       console.log(err);
//       return void 0;
//     }

//     let count = 0;
//     const successList: string[] = [];

//     function getRequest(route: string, type: string) {
//       const options = {
//         url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
//         method: 'POST',
//         // Your options, which must include the Content-Type and auth headers
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         json: {
//           url: getHref(route),
//           type
//         }
//       };

//       return request(options);
//     }

//     let submitedList: string[] = [];
//     if (existsSync(submitedPath)) {
//       submitedList = (await import('./data/submited')).default;
//     }

//     routes.forEach((route) => {
//       if (!submitedList.includes(route)) {
//         count++;
//         getRequest(route, 'URL_UPDATED');
//       }
//     });

//     submitedList.forEach((s) => {
//       if (!routes.includes(s)) {
//         count++;
//         getRequest(s, 'URL_DELETED');
//       }
//     });
//   });
// }

export function submit(routes: string[]) {
  routes;
}
