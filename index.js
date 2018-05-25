const express = require("express");
const request = require("request");

const utils = require("./utils");

// Feed example: https://www.ntrsct.com/products.xml
// Product category example: 1604 - Apparel & Accessories > Clothing
// Full List of product categories:
// https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
const { BIG_CARTEL_FEED, GOOGLE_PRODUCT_CATEGORY, PORT } = process.env;

if (!BIG_CARTEL_FEED)
    throw new Error("Missing BIG_CARTEL_FEED env variable");

// TODO:
// 0 [done] setup HTTP GET for /products.xml route w/ express
// 1 [done] HTTP GET provided URL w/ request
// 2 Parse the body w/ xml2js
// 3 iterate through items... foreach:
//      - HTML Decode chars from descriptions with string module S(str).unescapeHTML().s
//          root.rss.channel.item.g:description
//      - Strip all HTML tags with string module S(str).stripTags().s
//      - add g:google_product_category element w/ value from GOOGLE_PRODUCT_CATEGORY
// 6 render cleaned up feed to products.xml

const app = express();

app.get("/products.xml", (req, res) => {
    request.get(BIG_CARTEL_FEED, {}, (err, response, body) => {
        if (err) {
            res.send(`Error: ${err.message}`);
        } else {
            // TODO: res.body is undefined...
            utils.parseFeed(body);
        }
    });
});

app.listen(PORT || 3000, () => {
    console.log("Listening on port", PORT || 3000);
});