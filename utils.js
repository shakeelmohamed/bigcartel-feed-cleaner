const xml2js = require("xml2js");
const S = require("string");
const deepcopy = require("deepcopy");

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

ME.addProductMetadata = (feedObject, metadata) => {
    if (!feedObject || !feedObject.rss || !feedObject.rss.channel) {
        return feedObject;
    }

    let itemsPerSize = [];
    let items = feedObject.rss.channel[0].item;
    for (let i = 0; i < items.length; i++) {
        const productID = items[i]["g:id"];
        const productMeta = metadata[productID];

        // TODO: move harcoded stuff to the JSON file
        items[i]["g:google_product_category"] = process.env.GOOGLE_PRODUCT_CATEGORY;
        items[i]["g:age_group"] = "adult";
        items[i]["g:gender"] = "unisex";
        items[i]["g:brand"] = "ntrsct";
        items[i]["g:size_type"] = "regular";
        items[i]["g:size_system"] = "US";
        items[i]["g:item_group_id"] = productID;
        items[i]["g:color"] = productMeta.color;

        /**
         *
         * DONE:
         * - g:age_group = "adult"
         * - g:gender = "unisex"
         * - g:brand = "ntrsct" // TODO: add this same value to website organization rich markup
         * - g:size_type = "regular"
         * - g:size_system = "US"
         * - g:color = "black"|"black/white/green"
         * - g:size = S|M|L|XL // duplicate the entire entry for each size variant
         * * - multiple sibling g:shipping tags (without a parent) for all "groups":
         *     g:country = US|CA|* // get code from https://en.wikipedia.org/wiki/ISO_3166-2
         *     g:price = "0.00 USD"|"5 USD"|"10 USD"
         
            <g:shipping>
                <g:country>US</g:country>
                <g:price>0.00 USD</g:price>
            </g:shipping>
         */

        items[i]["g:shipping"] = [{
            "g:country": "US",
            "g:price": "0.00 USD"
        }, {
            "g:country": "CA",
            "g:price": "5.00 USD"
        }];

        const itemWithSizes = getItemsBySize(items[i], productMeta.sizes);
        itemsPerSize.push(...itemWithSizes);
    }

    feedObject.rss.channel[0].item = itemsPerSize;
    return feedObject;
};

function getItemsBySize(item, sizes) {
    let items = [];
    for (const size of sizes) {
        let itemWithSize = deepcopy(item);
        itemWithSize["g:size"] = size;
        itemWithSize["g:id"] = itemWithSize["g:id"] + "_" + size;
        items.push(itemWithSize);
    }
    return items;
}

ME.objToFeed = (obj) => {
    const builder = new xml2js.Builder({headless: true});
    return builder.buildObject(obj);
};