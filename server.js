const express = require('express');
const dateFormat = require('dateformat');
const request = require('request');
const bodyParser = require('body-parser');

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

  const tiers = req.body.draftPack.map(cardId => {
    return Math.floor(Math.random() * 5);
  });

  return res.status(200).send({
    ...req.body,
    tiers
  });
})

app.get('*', (req, res) => {
  res.render('./dist/index.html');
});

// Error handling
app.use(function (err, req, res, next) {
    // Return 500 for any uncaught errors
    console.log(err);
    res.status(500).send('Something broke!');
});

var server=app.listen((process.env.PORT || 3010),function(){
console.log("We have started our server on port " +(process.env.PORT || 3010));
});


module.exports = app;