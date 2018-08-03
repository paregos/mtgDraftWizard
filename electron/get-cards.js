const axios = require('axios');
const fs = require('fs');

const cards = {};

var page = 0;

function getCards(url) {
  page++;
  console.log(`Getting page ${page}...`)
  axios.get(url)
    .then(res => {
      cardList = res.data.data;
      nextUrl = res.data.next_page;
      cardList.forEach(card => {
        cards[card.arena_id] = {
          name: card.name,
          cost: card.mana_cost,
          colors: card.colors,
          colorIdentity: card.color_identity
        }
      });

      if(nextUrl) {
        getCards(nextUrl);
      } else {
        console.log('Done downloading');
        fs.writeFile('cards.json', JSON.stringify(cards), err => {
          if(err) {
            console.log(err);
          } else {
            console.log('Done writing to file');
          }
        })
      }
    })
}

getCards('https://api.scryfall.com/cards/search?q=game:arena');