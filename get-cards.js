const axios = require('axios');
const fs = require('fs');

const db = require('./model/db');

const cards = {};

var page = 0;

function writeCards(cards) {
  // Write to json for use by the electron client
  fs.writeFile('electron/cards.json', JSON.stringify(cards), err => {
    if(err) {
      console.log(err);
    } else {
      console.log('Done writing to file');
    }
  });

  // Write to DB for use by the server
  db.Card.destroy({ where: {} })
    .then(() => {
      return db.Card.bulkCreate(Object.keys(cards).map(key => {
        return {
          id: parseInt(key),
          name: cards[key].name
        }
      }))
    })
    .then(() => {
      console.log('Done writing to database');
    });
}

function getCards(url) {
  page++;
  console.log(`Getting page ${page}...`)
  axios.get(url)
    .then(res => {
      cardList = res.data.data;
      nextUrl = res.data.next_page;
      cardList.forEach(card => {
        // Double check that it has an ID set
        // Some cards are in the list but dont have a MTGA ID
        if(card.arena_id) {
          cards[card.arena_id] = {
            name: card.name,
            cost: card.mana_cost,
            colors: card.colors,
            colorIdentity: card.color_identity
          }
        }
      });

      if(nextUrl) {
        getCards(nextUrl);
      } else {
        console.log('Done downloading');
        writeCards(cards);
      }
    })
}

db.syncedPromise.then(() => {
  getCards('https://api.scryfall.com/cards/search?q=game:arena');
});