process.env.MTGA_RESET_TABLES = true;

const db = require('./model/db');
const getCards = require('./scrapers/get-cards');
const scrapeLsv = require('./scrapers/lsv-scraper');
const scrapeLrc = require('./scrapers/lrc-scraper');
const scrapeDraftaholics = require('./scrapers/draftaholics-scraper');

db.syncedPromise
  .then(() => {
    console.log('Getting Cards...')
    return getCards()
  })
  .then(() => {
    console.log('Card list created');
    console.log('Getting card scores...');
    return Promise.all([
      scrapeLsv(),
      scrapeLrc(),
      scrapeDraftaholics()
    ])
  })
  .then(() => {
    console.log('Done');
  })