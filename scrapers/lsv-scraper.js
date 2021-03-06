/*
 * Script for scraping tier data from LSV's set reviews
 */

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../model/db");

// Set name as used in the url of the page
const sets = ["kaladesh", "aether-revolt", "amonkhet", "hour-of-devastation", "ixalan", "rivals-of-ixalan", "dominaria", "core-set-2019"];

const colors = [
    "white",
    "blue",
    "black",
    "red",
    "green",
    // Most sets have golds, artifacts, and lands grouped together
    "gold-artifacts-and-lands",
    // Amonkhet missed the 's' after artifacts
    "gold-artifact-and-lands",
    // Kaladesh had artifacts separate
    "gold-lands",
    "artifacts",
    // Aether Revolt didn't have lands
    "artifacts-and-gold"
];

function parsePage(url) {
    return axios
        .get(url)
        .then((res) => {
            // Regex to match a single card (or group of cards)
            // Note: sometimes cards are grouped together (e.g land cycles)
            return (
                res.data
                    // Get rid of the 'Ratings Scale' header since it causes false matches
                    .replace(/<h1>Ratings Scale<\/h1>/g, "")
                    /* 
         * Reviews are in the format
         * <h1>{Card Name}</h1>
         * {picture[s]}
         * <h3>Limited: {Rating} [// {second rating}]</h3>
         * <p>{description}></p>
         */
                    .match(/<h1>.+?<\/h1>[\s\S]+?<h3>Limited:.+?<\/h3>[\s\S]+?<p>[\s\S]+?<\/p>/g)
                    .reduce((acc, html) => {
                        let rating = html.match(/<h3>Limited: .+?<\/h3>/g)[0].slice(13, -5);
                        // Ratings are out of 5.0. Normalise to be out of 100
                        if (rating.split("//").length > 1) {
                            // There is more than one rating depending on the situation. Take the average
                            let total = 0;
                            rating.split("//").forEach((n) => {
                                total += parseFloat(n);
                            });
                            rating = (total / rating.split("//").length) * 20;
                        } else {
                            rating = parseFloat(rating) * 20;
                        }

                        // Get the description of the rating
                        const descriptionHtml = html.match(/<p>[\s\S]+?<\/p>/g);
                        let description;
                        if (descriptionHtml) {
                            const $ = cheerio.load(descriptionHtml[0]);
                            description = $("p").text();
                        }

                        // Remove the description from the html since it causes false positives when matching the cards being rated
                        html = html.replace(/<p>[\s\S]+?<\/p>/g, "");

                        // Get all the cards being rated
                        let cards = {};
                        html.match(/data-name=".+?"/g).forEach((cardName) => {
                            cardName = cardName.slice(11, -1);
                            cards[cardName] = {};
                            // Don't add the rating if it's NaN
                            if (!isNaN(rating)) {
                                cards[cardName].rating = rating;
                            }
                            if (description) {
                                cards[cardName].description = description;
                            }
                        });

                        // Add it to the list
                        return {
                            ...acc,
                            ...cards
                        };
                    }, {})
            );
        })
        .then((cards) => {
            console.log(`LSV: GET ${url}`);
            return Promise.all(
                Object.keys(cards).map((name) => {
                    return db.Card.update({ lsvRating: cards[name].rating, lsvDescription: cards[name].description }, { where: { name: name } });
                })
            );
        })
        .catch((err) => {
            console.error(`LSV: ERR ${url}`);
        });
}

function scrape() {
    return db.syncedPromise.then(() => {
        return Promise.all(
            sets.map((set) => {
                return Promise.all(
                    colors.map((color) => {
                        return parsePage(`https://www.channelfireball.com/articles/${set}-limited-set-review-${color}`);
                    })
                );
            })
        );
    });
}

module.exports = scrape;
