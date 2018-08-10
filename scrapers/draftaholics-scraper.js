const axios = require('axios');

const db = require('../model/db');

// Set name as used in the POST request
// Note: the spaces get turned to + when sending
const sets = [
  'Aether Revolt',
  'Amonkhet',
  'Hour of Devastation',
  'Ixalan',
  'Rivals of Ixalan',
  'Dominaria',
  'Core Set 2019'
]

function scrape() {
  return db.syncedPromise.then(() => {
    return Promise.all([
      ...sets.map(set => {
        const params = new URLSearchParams();
        params.append('action', 'brunchier_p1p1_load_results');
        params.append('set_name', set);

        return axios.post('http://www.draftaholicsanonymous.com/wp-content/themes/draftaholics/draftaholics-ajax.php', params)
          .then(res => {
            console.log(`DRA: GET ${set}`);

            // Use the rating of the top rated card as 100% and the bottom rated as 0%
            const maxRating = res.data[0].ELO;
            const minRating = res.data[res.data.length - 1].ELO;
            const ratingRange = maxRating - minRating;
            return Promise.all(res.data.map(card => {
              return db.Card.update(
                { draftaholicsRating: (card.ELO - minRating) / ratingRange * 100 },
                { where: { name: card.CardName }}
              );
            }))
          })
          .catch(err => {
            console.error(`DRA: ERR ${set}`);
          })
      }),

      // Kaladesh ratings are in the HTML
      axios.get('http://www.draftaholicsanonymous.com/p1p1-kaladesh/')
        .then(res => {
          console.log(`DRA: GET Kaladesh`);

          const matches = res.data.match(/<tr onmouseover[\s\S]+?<\/tr>/g);
          const maxRating = parseInt(matches[0].match(/<td\>\d+?<\/td>/g)[0].slice(4, -5));
          const minRating = parseInt(matches[matches.length - 1].match(/<td>\d+?<\/td>/g)[0].slice(4, -5));
          const ratingRange = maxRating - minRating;

          return Promise.all(matches.map(cardHtml => {
            const rating = parseInt(cardHtml.match(/<td>\d+?<\/td>/g)[0].slice(4, -5));
            const name = cardHtml.match(/<td>.+?<\/td>/g)[1].slice(4, -5);
            return db.Card.update(
              { draftaholicsRating: (rating - minRating) / ratingRange * 100 },
              { where: { name: name }}
            );
          }))
        })
        .catch(err => {
          console.error(`DRA: ERR Kaladesh`);
        })
      ])
  })
}

module.exports = scrape;