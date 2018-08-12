const axios = require("axios");
const fs = require("fs");

const db = require("../model/db");

function writeCards(cards) {
    return Promise.all([
        db.Card.findAll().then((cardIds) => {
            const cardMappings = {};
            cardIds.forEach((card) => {
                cardMappings[card.id] = {
                    name: card.name,
                    ...cards[card.name]
                };
            });

            return new Promise((resolve, reject) => {
                // Write to json for use by the electron client
                fs.writeFile("electron/cards.json", JSON.stringify(cards), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }),

        // Write to DB for use by the server
        Promise.all(
            Object.keys(cards).map((key) => {
                return db.Card.update(
                    {
                        // Placeholder for when more properties are stored on the server DB later, add them here
                        name: key
                    },
                    { where: { name: key } }
                );
            })
        )
    ]);
}

function getCards(url, cards, pageNumber) {
    console.log(`Getting page ${pageNumber}...`);
    return axios.get(url).then((res) => {
        cardList = res.data.data;
        nextUrl = res.data.next_page;

        // Note: when a card appears in multiple sets, Scryfall doesn't seem to list an ID
        cardList.forEach((card) => {
            cards[card.name] = {
                cost: card.mana_cost,
                colors: card.colors,
                colorIdentity: card.color_identity
            };
        });

        if (nextUrl) {
            return getCards(nextUrl, cards, pageNumber + 1);
        } else {
            return writeCards(cards);
        }
    });
}

function scrape() {
    return db.syncedPromise
        .then(() => {
            // Delete all card entries
            return db.Card.destroy({ where: {} });
        })
        .then(() => {
            // Get the complete list of MTGA card IDs from this guy's repo
            return axios.get("https://raw.githubusercontent.com/Fugiman/deckmaster/master/client/types/cards.go");
        })
        .then((res) => {
            // Build array of [id, name]
            const cardIds = res.data.match(/Card{.+}/g).map((cardRow) => {
                const cardInfo = cardRow.match(/".+?"/g);
                const cardId = parseInt(cardInfo[0].slice(1, -1));
                const cardName = cardInfo[1].slice(1, -1);
                return {
                    id: cardId,
                    name: cardName
                };
            });

            // Write mapping to DB
            return db.Card.bulkCreate(cardIds);
        })
        .then(() => {
            return getCards("https://api.scryfall.com/cards/search?q=game:arena", {}, 1);
        });
}

module.exports = scrape;
