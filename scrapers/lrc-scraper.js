const axios = require('axios');
const GoogleSpreadsheet = require('google-spreadsheet');

const db = require('../model/db');

// Google API credentials
// TODO: change to use environment variable
const credentials = {
  "type": "service_account",
  "project_id": "mtga-draft-wizard",
  "private_key_id": "5f91811f3f8fc02f5c674a955319503fb8f03400",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDEcVu5OUET0E48\npa93YR+nKhZGThP2RFH4sr/19c78ooVvIC6LvJdUVK9DGGVUfXdR+EogYxXlBWBO\nzS3fb23n4W3lR7TeWH04L94wU/r+Zevo9XYqVtETChqmPwCkjKxKft7tDXhbpMpI\nlftjfokjlqZfleC5Y+JboWkQ7RToq0t3PX1vhC9SfbVwnnuejDfzX6YgNYXXixBJ\nc7FMr+0K32SZ49b5cmFy7u4ZyIYJkKU6+SRnzcC7HMcqq706np03iIwqNTcz1/9q\nGaIJb/OvuiBtvn9yMGI7DP+U/wuz8ZeccWSkOX5zD73MZwy1x8wb/gSlpmT7oUy+\nAkbaQP57AgMBAAECggEAYbGgdJqxLxnits2NWFjgZYGMR1WQHuK2Q3Ed/0PKNyDa\nLDw8ebkGJ2XgLYWF60FkZEsPDlFIs7d7QGVQ4XQom++j+CkznXozeAxyOuWhBwCI\nFLhyFjdLzeSyASiG+M6O5pN26TxQNX9cLEIOndnxeNX0ksfWVUyD5577wfOt+NFL\nJ7w1batYRKHYJU0yn8SDwKfSxcLurUjuGTgMs9eX1X1QoQtjM8wzI6ss3FUGUoo8\nDU/To+id8r4sHEcCbbIviUFtasyv1ybk3uYiC6Svzx1xkIR6rikThQMTQBgCaPOK\ndVtsxN6TMrCuXj2P15UWcfUjfFs7NPp1kB4IGX60aQKBgQD5kxuxD+mG8JUO2aXE\nxFgGKwyk1XSjVrFYa6eys2j3bm1nUJ/ltzFyRcRQpXT3Kvbixph34OTomsDc9XgH\ngLketHYkZVvJAABkBuQI+bH8g9zAq3OG1WRelUKR3/u8UzNHVyGnC37rh/sQO36x\nHpH6Po2TMttTaifs6gjMaOilQwKBgQDJgBHgNw2C+61BmTYZKhFrD4R3QFEqcw+Y\n+SQwrikALsZSraCDsKd/7eY9pfPUTq1QFHdpzPNc1ZgqG+rNWeCdW3syGc+2mW1r\nwE89VGqpDCVhID6zZJx3F+ax8Dn6UzTZ+lMpCHIPXCv6ZWfaO49MfnwVhcOlQ482\nsGqJBUeSaQKBgHS4QgkrAfJj7bJGQ+qkUO6Bj6Y/Vg9V6hcKMiG3Gm4trOjWohFS\n/cMNseRtnShDZbdlXcUi3quSRISSIJKRtwIPL/mRlb2JTKV7O4afEIiiOsm45Yy3\nm/tIHxwN/rNyzdadf1WaYL9Sly5eRMAdJfQ88QVYkY6PZSC9y2Od5L/1AoGAXlp6\nBGPDD/KJzo3PpzjrrxY1ESIs35PBWgBP0fu7dzpv44cqAoBV7rGXfoaXBnNQ9I6g\n3An8axwZhJ5N9JqBcy3DIlKz0O1HL419jVpaF454cmKG+bnDCoFGpUu32l/b/7YX\n+r7ZqhefAEE7wBTjpQ4VTH62fkyEYzd4q3CtcwECgYBFFueupvHSENBtHtaApC7+\nt6I7nu5bAoXFMDZbOW88lRrPw4DOJ4Dpw5JwEfOSsE4eLYEa8PGHKVziG+hRNqxJ\nP+Z/ZXgXFeB6ipa84QGhNTmMP2lR8Bq/qq4varEhf+d+qK1xto0Jm9BS0Xf+ogcu\n+airA82fe1VRJBt4PvDxlQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "server@mtga-draft-wizard.iam.gserviceaccount.com",
  "client_id": "102881999548084291450",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/server%40mtga-draft-wizard.iam.gserviceaccount.com"
}

// Set name as used in the GET request
const sets = [
  'hour-of-devastation',
  'ixalan',
  'rivals-of-ixalan',
  'dominaria',
  'core-set-2019'
]

/*
 * The page html contains an iframe
 * The iframe's html contains an ID for a settings.json
 * The settings.json contains an ID for a Google sheet
 * The Google sheet contains a TableSource worksheet
 * The worksheet contains the data
 *
 * Page HTML -> iframe HTML -> settings.json -> Google sheet -> TableSource
 *
 * -_-
 *
 */

function parsePage(url) {
  return axios.get(url)
    .then(res => {
      // The page embeds an iframe to show a google sheets table
      const tableIframeUrl = res.data.match(/<iframe width="100%".+?>/g)[0].slice(62, -2);
      // The ID of the settings.json is in the html of the embedded page
      return axios.get(tableIframeUrl)
    })
    .then(res => {
      // Get the settings.json ID from the html of the embedded table
      const settingsJsonId = res.data.match(/data-viewID=".+?"/g)[0].slice(13, -1);
      // The ID of the google sheet is in the settings.json
      return axios.get(`https://awesome-table.firebaseio.com/views/${settingsJsonId}/settings.json`);
    })
    .then(res => {
      sheetId = res.data.url.match(/\/d\/.+?\//g)[0].slice(3, -1);
      const doc = new GoogleSpreadsheet(sheetId);

      return (
        // The google-spreadsheet package uses callbacks. Convert them to promises here
        new Promise((resolve, reject) => {
          // Authenticate (it's a public sheet but still requires authentication - I think it's unlisted probably)
          doc.useServiceAccountAuth(credentials, resolve);
        })
        .then(() => {
          // Get the info of the spreadsheet
          return new Promise((resolve, reject) => {
            doc.getInfo((err, info) => {
              if(err) {
                reject(err);
              } else {
                resolve(info);
              }
            })
          })
        })
        .then(info => {
          // Get the rows of the worksheet
          return new Promise((resolve, reject) => {
            // Find the sheet named 'TableSource' or 'Table Source'
            let sheet;
            for(var i = 0; i < info.worksheets.length; i++) {
              if(info.worksheets[i].title == 'TableSource'
              || info.worksheets[i].title == 'Table Source') {
                sheet = info.worksheets[i];
              }
            }

            // The first 2 rows are headings. Data starts from the 3rd
            sheet.getRows({
              offset: 2
            }, (err, rows) => {
              if(err) {
                reject(err);
              } else {
                resolve(rows);
              }
            })
          });
        })
        .then(rows => {
          console.log(`LRC: GET ${url}`);

          // Use the rating of the top rated card as the base (100%)
          const maxRating = rows[0].numericgrade;
          const minRating = rows[rows.length - 1].numericgrade;
          const ratingRange = maxRating - minRating;

          return Promise.all(rows.map(row => {
            return db.Card.update(
              { lrcRating: ((row.numericgrade - minRating) / ratingRange * 100).toFixed(1) },
              { where: { name: row.name}}
            );
          }))
        })

      )
    })
    .catch(err => {
      console.error(`LRC: ERR ${url}`);
    })
}

function scrape() {
  return db.syncedPromise.then(() => {
    return Promise.all(sets.map(set => {
      return parsePage(`https://www.mtgcommunityreview.com/${set}`);
    }))
  })
}

module.exports = scrape;