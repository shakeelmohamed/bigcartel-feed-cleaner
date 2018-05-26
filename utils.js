const xml2js = require("xml2js");
const S = require("string");

let ME = module.exports;

ME.parseFeed = (feed, done) => {
    const opts = {
        valueProcessors: [(val, name) => {
            console.log("valueProcessors: val, name ", name);
            switch(name) {
                case "g:description":
                    return ME.cleanDescription(val);
                default:
                    return val;
            }
        }]
    };
    xml2js.parseString(feed, opts, done);
};

ME.cleanDescription = (val) => {
    let ret = S(val).unescapeHTML().s;

    ret = ret.replace(/<table>(.|\s)*?<\/table>/g, "");
    ret = ret.replace(/<br\s*[?]>/g, "");

    // TODO: see comments for step 3, index.js

    ret = S(ret).stripTags().s;
    return ret;
};

ME.addGPC = (feedObject) => {
    console.log(feedObject.rss.channel);
    // TODO: validate for undefined at each level
    let items = feedObject.rss.channel[0].item;
    items.forEach((item) => {
        item["g:google_product_category"] = process.env.GOOGLE_PRODUCT_CATEGORY;
    });
    return feedObject;
};

ME.objToFeed = (obj) => {
    var builder = new xml2js.Builder({headless: true});
    var xml = builder.buildObject(obj);
    return xml;
};