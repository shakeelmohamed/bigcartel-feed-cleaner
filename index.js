const express = require("express");
const request = require("request");

const utils = require("./utils");

// Feed example: https://www.ntrsct.com/products.xml
// Product category example: 1604 - Apparel & Accessories > Clothing
// Full List of product categories:
// https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
const { BIG_CARTEL_FEED, PORT } = process.env;

if (!BIG_CARTEL_FEED)
    throw new Error("Missing BIG_CARTEL_FEED env variable");

// Steps:
// 0 [done] setup HTTP GET for /products.xml route w/ express
// 1 [done] HTTP GET provided URL w/ request
// 2 [done] Parse the body w/ xml2js
// 3 iterate through items... foreach:
//      - [done] HTML Decode chars from descriptions with string module S(str).unescapeHTML().s
//          root.rss.channel.item.g:description
//      - [done] Strip all HTML tags with string module S(str).stripTags().s
//      - [done] add g:google_product_category element w/ value from GOOGLE_PRODUCT_CATEGORY
//      - Text from HTML headings should remain
//      - remove all duplicate/triplicate? &#xD; chars, I think <br>s have become this somehow
// 4 [done] render cleaned up feed to products.xml

// TODO: setup CD on merge to master to Heroku

const app = express();

app.get("/products.xml", (req, res) => {
    request.get(BIG_CARTEL_FEED, {}, (err, response, body) => {
        if (err) {
            res.send(`Error: ${err.message}`);
        } else {
            utils.parseFeed(body, (err, feedObject) => {
                // TODO: ensure rss/XML header is sent back instead of json
                if (err) {
                    res.send(`Error: ${err.message}`);
                } else {
                    const feedWithGPC = utils.addGPC(feedObject);
                    const finalFeed = utils.objToFeed(feedWithGPC);
                    res.set("Content-Type", "application/xml; charset=utf-8");
                    res.send(finalFeed);
                }
            });
        }
    });
});

app.listen(PORT || 3000, () => {
    console.log("Listening on port", PORT || 3000);
});