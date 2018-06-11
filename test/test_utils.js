const assert = require("assert");
const utils = require("../utils");

describe("utils.cleanDescription()", () => {
    it("h2 - size chart", () => {
        const input = "&lt;h2&gt;Size Chart&lt;/h2&gt;";
        assert.strictEqual(utils.cleanDescription(input), "");
    });
    it("h1", () => {
        const input = "&lt;h1&gt;Special content&lt;/h1&gt;";
        assert.strictEqual(utils.cleanDescription(input), "Special content");
    });
    it("many newlines get trimmed to 2", () => {
        const input = "\n\n\n\n\n\n\n\n\n\n\n\n\n";
        assert.strictEqual(utils.cleanDescription(input), "\n\n");
    });
    it("table", () => {
        const input = `
            &lt;table&gt;
                &lt;thead&gt;
                    &lt;tr&gt;
                        &lt;td&gt;Size&lt;/td&gt;
                        &lt;td&gt;Chest (in.)&lt;/td&gt;
                        &lt;td&gt;Waist (in.)&lt;/td&gt;
                    &lt;/tr&gt;
                &lt;/thead&gt;
                &lt;tbody&gt;
                    &lt;tr&gt;
                        &lt;td&gt;Small&lt;/td&gt;
                        &lt;td&gt;36-38&lt;/td&gt;
                        &lt;td&gt;30-32&lt;/td&gt;
                    &lt;/tr&gt;
                    &lt;tr&gt;
                        &lt;td&gt;Medium&lt;/td&gt;
                        &lt;td&gt;40-42&lt;/td&gt;
                        &lt;td&gt;32-33&lt;/td&gt;
                    &lt;/tr&gt;
                    &lt;tr&gt;
                        &lt;td&gt;Large&lt;/td&gt;
                        &lt;td&gt;42-44&lt;/td&gt;
                        &lt;td&gt;33-34&lt;/td&gt;
                    &lt;/tr&gt;
                    &lt;tr&gt;
                        &lt;td&gt;Extra Large&lt;/td&gt;
                        &lt;td&gt;46-48&lt;/td&gt;
                        &lt;td&gt;36-38&lt;/td&gt;
                    &lt;/tr&gt;
                &lt;/tbody&gt;
            &lt;/table&gt;
        `;
        assert.strictEqual(utils.cleanDescription(input).trim(), "");
    });
});

describe("utils.addGPC()", () => {
    it("add GPC to array of empty objects", () => {
        process.env.GOOGLE_PRODUCT_CATEGORY = "1234";
        let feed = {
            rss: {
                channel: [{
                    item: [{foo: "bar"}, {some: "value"}]
                }]
            }
        };
        const result = utils.addGPC(feed);
        assert.strictEqual(result.rss.channel[0].item.length, 2);
        result.rss.channel[0].item.forEach((item) => {
            assert.strictEqual(item["g:google_product_category"], "1234");
        });
    });
});