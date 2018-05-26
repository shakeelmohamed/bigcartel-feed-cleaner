const assert = require("assert");
const utils = require("../utils");

describe("utils.cleanDescription()", () => {
    it("h2", () => {
        const input = "&lt;h2&gt;Size Chart&lt;/h2&gt;";
        assert.strictEqual(utils.cleanDescription(input), "Size Chart");
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