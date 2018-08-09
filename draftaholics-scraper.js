const axios = require('axios');

const db = require('./model/db');

// Set name as used in the POST request
const sets = [
  'Kaladesh',
  'Aether+Revolt',
  'Amonkhet',
  'Hour+of+Devastation',
  'Ixalan',
  'Rivals+of+Ixalan',
  'Dominaria',
  'Core+Set+2019'
]

db.syncedPromise.then(() => {
  sets.forEach(set => {
    const params = new URLSearchParams();
    params.append('action', 'brunchier_p1p1_load_results');
    params.append('set_name', set);
    axios.post('http://www.draftaholicsanonymous.com/wp-content/themes/draftaholics/draftaholics-ajax.php', params)
    .then(res => {
      // Use the rating of the top rated card as the base (100%)
      const maxRating = res.data[0].ELO;
      return Promise.all(res.data.map(card => {
        return db.Card.update(
          { draftaholicsRating: card.ELO / maxRating },
          { where: { name: card.CardName }}
        );
      }))
    })
    .then(() => {
      console.log('Done writing to database');
    })
  })
})