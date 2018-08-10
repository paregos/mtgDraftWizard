const express = require('express');
const dateFormat = require('dateformat');
const request = require('request');
const bodyParser = require('body-parser');
const Op = require('sequelize').Op;

const db = require('./model/db');

// Initialisation
const app=express();
const router = express.Router();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/src'));

app.set('views',__dirname);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.post('/tiers', (req, res) => {
  if(typeof req.body.packNumber != 'number') return res.status(400).send('packNumber not set');
  if(typeof req.body.pickNumber != 'number') return res.status(400).send('pickNumber not set');
  if(!req.body.draftPack) return res.status(400).send('draftPack not set');
  if(!req.body.pickedCards) return res.status(400).send('pickedCards not set');

  db.Card.findAll({
    where: {
      id: {
        [Op.or]: req.body.draftPack
      }
    },
    raw: true
  })
  .then(cards => {
    // Create dummy cards to fill space for cards not in the database
    while(cards.length < req.body.draftPack.length) {
      cards.push({ });
    }

    cards = cards.map(card => {
      let ratings = 0;
      let totalRating = 0;
      if(typeof card.lsvRating == 'number') {
        totalRating += card.lsvRating;
        ratings++;
      }
      if(typeof card.draftaholicsRating == 'number') {
        totalRating += card.draftaholicsRating;
        ratings++;
      }
      if(typeof card.lrcRating == 'number') {
        totalRating += card.lrcRating;
        ratings++;
      }

      if(ratings == 0) {
        return {
          ...card,
          rating: -1
        }
      } else {
        return {
          ...card,
          rating: totalRating / ratings
        }
      }
    });

    cards.sort((a, b) => {
      return b.rating - a.rating;
    })
    console.log(cards);
    res.status(200).send({
      ...req.body,
      processedCards: cards
    });
  })
});

app.get('*', (req, res) => {
  res.render('./dist/index.html');
});

// Error handling
app.use(function (err, req, res, next) {
    // Return 500 for any uncaught errors
    console.log(err);
    res.status(500).send('Something broke!');
});

db.syncedPromise.then(() => {
  app.listen((process.env.PORT || 3010), () => {
    console.log("We have started our server on port " +(process.env.PORT || 3010));
  });
});


module.exports = app;