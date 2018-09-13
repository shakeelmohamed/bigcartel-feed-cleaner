const assert = require("assert");
const data = require("../product-metadata");

describe("product-metadata.json", () => {
    it("exists", () => {
        assert.notEqual(data, null);
    });

    it("looks like Map<ID, Object>", () => {
        const keys = Object.keys(data);
        for (const key of keys) {
            assert.equal(typeof key, "string");

            const product = data[key];
            assert.ok(product instanceof Object);
            assert.ok(product.sizes instanceof Array);

            for (const size of product.sizes) {
                assert.equal(typeof size, "string");
            }

            assert.equal(typeof product.color, "string");
        }
    });
});