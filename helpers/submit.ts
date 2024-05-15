import { getEnv, resolve } from './utils';

import { existsSync, writeFileSync } from 'fs';
import { request } from 'gaxios';
import { google } from 'googleapis';

interface SubmitError {
  response?: {
    data: any;
  };
}

process.env.http_proxy = 'http://127.0.0.1:7890'; /* Set proxy */
process.env.HTTPS_PROXY = 'http://127.0.0.1:7890';

const submitedPath = resolve('./helpers/data/submited.ts');

const { VITE_DOMAIN_PATH } = getEnv();

function getHref(path: string) {
  return new URL(path, VITE_DOMAIN_PATH).href;
}

function writeSubmited(submitedList: string[]) {
  try {
    writeFileSync(
      submitedPath,
      `export default ${JSON.stringify(submitedList, null, 2)}`,
      'utf-8'
    );
  } catch (err) {
    console.log('write fail', err);
  }
}

export async function submit(routes: string[]) {
  let submitedList: string[] = [];
  let count = 0;
  let key: typeof import('./data/service_account.json');

  const updateList: string[] = [];
  const deleteList: string[] = [];

  try {
    key = (await import('./data/service_account.json')).default;

    if (existsSync(submitedPath)) {
      submitedList = (await import('./data/submited')).default;
    }

    routes.forEach((route) => {
      if (!submitedList.includes(route)) {
        updateList.push(route);
      }
    });

    submitedList.forEach((s) => {
      if (!routes.includes(s)) {
        deleteList.push(s);
      }
    });

    submitedList = submitedList.filter((s) => !deleteList.includes(s));

    if (updateList.length + deleteList.length === 0) return void 0;
  } catch (err) {
    return console.log('start err', err);
  }

  const jwtClient = new google.auth.JWT(
    key.client_email,
    void 0,
    key.private_key,
    ['https://www.googleapis.com/auth/indexing'],
    void 0
  );

  jwtClient.authorize(async function (err, tokens) {
    if (err) {
      console.log(err);
      return void 0;
    }

    async function getRequest(route: string, type: string) {
      count++;

      try {
        const res = await request({
          url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${tokens!.token_type} ${tokens!.access_token}`
          },
          data: JSON.stringify({
            url: getHref(route),
            type
          })
        });
        console.log('submit res: ', res.data);

        submitedList.push(route);
      } catch (err) {
        console.log('submit err: ', (err as SubmitError)?.response?.data);
      } finally {
        count--;

        if (count <= 0) {
          writeSubmited(submitedList);
        }
      }
    }

    updateList.map((u) => getRequest(u, 'URL_UPDATED'));
    deleteList.map((d) => getRequest(d, 'URL_DELETED'));
  });
}
