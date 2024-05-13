/* eslint-disable no-undef */
// import key from './service_account.json';

// import gapi from 'gapi';
import { google } from 'googleapis';

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/indexing'],
  null
);

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return process.exit(-1);
  }

  // const batch = gapi.client.newBatch();

  const options = {
    url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    auth: { bearer: tokens.access_token },
    json: {
      url: 'http://example.com/jobs/42',
      type: 'URL_UPDATED'
    }
  };

  request(options, function (error, response, body) {
    // Handle the response
    console.log(body);
  });
});
