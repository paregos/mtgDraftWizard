const express = require('express');
const dateFormat = require('dateformat');
const request = require('request');
const bodyParser = require('body-parser');

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

  Promise.all(req.body.draftPack.map(cardId => {
    return db.Card.findById(cardId).then(card => {
      if(!card) {
        return '?';
      }
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
        return '?';
      } else {
        return totalRating / ratings;
      }
    });
  }))
  .then(tiers => {
    return res.status(200).send({
      ...req.body,
      tiers
    });
  });
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