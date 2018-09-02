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

    // Remove LF
    ret = ret.replace(/\r/g, "");

    // Remove the size chart heading above the <table>
    ret = ret.replace(/<h\d>\s*Size Chart\s*<\/\s*h\d>/gi, "");

    // Remove all <table> tags entirely
    ret = ret.replace(/<table>(.|\s)*?<\/table>/g, "");

    // Trim 2+ newlines to 2
    ret = ret.replace(/\n{2,}/g, "\n\n");

    ret = S(ret).stripTags().s;
    return ret;
};

// TODO: rename to addProductMetadata
ME.addGPC = (feedObject) => {
    if (!feedObject || !feedObject.rss || !feedObject.rss.channel) {
        return feedObject;
    }

    let items = feedObject.rss.channel[0].item;
    for (let i = 0; i < items.length; i++) {
        items[i]["g:google_product_category"] = process.env.GOOGLE_PRODUCT_CATEGORY;
        imems[i]["g:age_group"] = "adult";
        imems[i]["g:gender"] = "unisex";
        imems[i]["g:brand"] = "ntrsct"; // TODO: add this same value to website organization rich markup
        /**
         * TODO: also need to set the following:
         * - g:age_group = "adult"
         * - g:gender = "unisex"
         * - g:brand = "ntrsct" // TODO: add this same value to website organization rich markup
         * - multiple sibling g:shipping tags (without a parent) for all "groups":
         *     g:country = US|CA|* // get code from https://en.wikipedia.org/wiki/ISO_3166-2
         *     g:price = free|"3 USD"|"5 USD"
         * - g:item_group_id = g:id
         * - g:color = "black"|"black/white/green"
         * - g:size = S|M|L|XL // TODO: duplicate the entire entry for each size variant... ugh.
         * product group may be needed: https://developers.facebook.com/docs/marketing-api/reference/product-group
         *
         * Optional:
         * - g:size_type = "regular"
         * - g:size_system = "US"
         */
    }
    return feedObject;
};

ME.objToFeed = (obj) => {
    var builder = new xml2js.Builder({headless: true});
    var xml = builder.buildObject(obj);
    return xml;
};