const axios = require("axios");
const fs = require("fs");

const db = require("../model/db");

function writeCards(cards) {
    return Promise.all([
        new Promise((resolve, reject) => {
            // Write to json for use by the electron client
            fs.writeFile("electron/cards.json", JSON.stringify(cards), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }),

        // Write to DB for use by the server
        db.Card.destroy({ where: {} }).then(() => {
            return db.Card.bulkCreate(
                Object.keys(cards).map((key) => {
                    return {
                        id: parseInt(key),
                        name: cards[key].name,
                        imageUrl: cards[key].imageUrl,
                        cardTypeLine: cards[key].cardTypeLine,
                        cardText: cards[key].cardText
                    };
                })
            );
        })
    ]);
}

function getCards(url, cards, pageNumber) {
    console.log(`Getting page ${pageNumber}...`);
    return axios.get(url).then((res) => {
        cardList = res.data.data;
        nextUrl = res.data.next_page;
        cardList.forEach((card) => {
            // Double check that it has an ID set
            // Some cards are in the list but dont have a MTGA ID
            if (card.arena_id) {
                cards[card.arena_id] = {
                    name: card.name,
                    cost: card.mana_cost,
                    colors: card.colors,
                    colorIdentity: card.color_identity,
                    imageUrl: card.image_uris ? card.image_uris.normal : null,
                    cardTypeLine: card.type_line || null,
                    cardText: card.oracle_text || null
                };
            }
        });

        if (nextUrl) {
            return getCards(nextUrl, cards, pageNumber + 1);
        } else {
            return writeCards(cards);
        }
    });
}

function scrape() {
    return db.syncedPromise.then(() => {
        return getCards("https://api.scryfall.com/cards/search?q=game:arena", {}, 1);
    });
}

module.exports = scrape;
