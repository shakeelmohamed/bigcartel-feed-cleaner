const xml2js = require("xml2js");
const S = require("string");

let ME = module.exports;

ME.parseFeed = (feed, done) => {
    const opts = {
        valueProcessors: [(val, name) => {
            console.log("valueProcessors: val, name ", val, name);
            switch(name) {
                case "description":
                    return ME.cleanDescription(val);
                default:
                    return val;
            }
        }]
    };
    xml2js.parseString(feed, opts, (err, result) => {
        let ret = result;
        if (!err) {
            console.log("Result");
            console.log(result);
            // TODO: add g:google_product_category element w/ value from process.env.GOOGLE_PRODUCT_CATEGORY
        }
        done(err, ret);
    });
};

ME.cleanDescription = (val) => {
    let ret = S(val).unescapeHTML().s;
    ret = ret.replace(/<table>(.|\s)*?<\/table>/g, "");
    ret = ret.replace(/<br\s*[?]>/g, "");
    ret = S(ret).stripTags().s;
    return ret;
};