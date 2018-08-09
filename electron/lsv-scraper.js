/*
 * Script for scraping tier data from LSV's set reviews
 */

const axios = require('axios');

// Set name as used in the url of the page
const setName = 'core-set-2019'

const colors = [
  'white',
  // 'blue',
  // 'black',
  // 'red',
  // 'green',
  // 'gold-artifacts-and-lands'
]

colors.reduce((acc, color) => {
  return {
    ...acc,
    ...parsePage(`https://www.channelfireball.com/articles/${setName}-limited-set-review-${color}`)
  }
}, {})

function parsePage(url) {
  axios.get(url)
    .then(res => {
      // Regex to match a single card (or group of cards)
      // Note: sometimes cards are grouped together (e.g land cycles)
      const ratings = res.data.match(/<h1>.+?<\/h1>[\s\S]+?<h3>Limited:.+?<\/h3>/g).reduce((acc, html) => {
        let rating = html.match(/<h3>Limited: .+?<\/h3>/g)[0].slice(13, -5);
        // Ratings are out of 5.0. Normalise to be out of 100
        if(rating.split('//').length > 1) {
          // There is more than one rating depending on the situation. Take the average
          let total = 0;
          rating.split('//').forEach(n => {
            total += parseFloat(n);
          })
          rating = total / rating.split('//').length * 20;
        } else {
          rating = parseFloat(rating) * 20
        }

        // Get all the cards being rated
        let cards = {};
        html.match(/data-name=".+?"/g).forEach(cardName => {
          cardName = cardName.slice(11, -1);
          cards[cardName] = rating;
        })

        // Add it to the list
        return {
          ...acc,
          ...cards
        }
      }, {});
      
    })
}