const request = require("request");
const xml2js = require("xml2js");
const S = require("string");

// ie: https://www.ntrsct.com/products.xml
const { BIG_CARTEL_FEED } = process.env;

if (!BIG_CARTEL_FEED)
    throw new Error("Missing BIG_CARTEL_FEED env variable");

// TODO: setup HTTP GET for /product.xml route
// 1 HTTP GET provided URL
// 2 Parse the body w/ xml2js
// 3 HTML Decode chars from descriptions with string module S(str).unescapeHTML().s
//     root.rss.channel.item.g:description
// 4 Strip all HTML tags with string module S(str).stripTags().s
// 5 render cleaned up feed to product.xml