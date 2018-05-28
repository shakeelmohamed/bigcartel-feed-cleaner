const xml2js = require("xml2js");
const S = require("string");

let ME = module.exports;

ME.parseFeed = (feed, done) => {
    const opts = {
        valueProcessors: [(val, name) => {
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
    let ret = val.replace(/\r/g, "");
    ret = S(val).unescapeHTML().s;

    ret = ret.replace(/<table>(.|\s)*?<\/table>/g, "");
    ret = ret.replace(/\r/g, "");

    ret = S(ret).stripTags().s;
    return ret;
};

ME.addGPC = (feedObject) => {
    if (!feedObject || !feedObject.rss || !feedObject.rss.channel || 
        !feedObject.rss.channel.length < 1 || !feedObject.rss.channel[0].item) {
        return feedObject;
    }

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