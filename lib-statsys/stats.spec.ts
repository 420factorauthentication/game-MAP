/** @format */

import Stats from "./stats";

jest.setTimeout(1000);

describe("A Stats instance", () => {
    it("is not extensible", () => {
        const stats = new Stats({a: 1});
        expect(() => {
            Object.defineProperty(stats, "newProp", {value: 42});
        }).toThrow();
    });
});

describe("Stats.base", () => {
    it("is writable", () => {
        const stats = new Stats({a: 1});
        expect(() => {
            stats.base = {b: 2};
        }).not.toThrow();
    });

    it("is a reference", () => {
        let handle = {a: 1};
        const stats = new Stats(handle);
        expect(stats.base["a"]).toBe(1);
        handle.a = 2;
        expect(stats.base["a"]).toBe(2);
        handle = {a: 3};
        expect(stats.base["a"]).toBe(2);
    });

    it("inherits reference mutability", () => {
        expect(() => {
            const obj = {a: 1};
            const stats = new Stats(obj);
            stats.base["a"] = 2;
        }).not.toThrow();
        expect(() => {
            const obj = Object.freeze({a: 1});
            const stats = new Stats(obj);
            stats.base["a"] = 2;
        }).toThrow();
    });

    it("inherits reference extensibility", () => {
        expect(() => {
            const obj = {a: 1};
            const stats = new Stats(obj);
            Object.defineProperty(stats, "b", {value: 2});
        }).not.toThrow();
        expect(() => {
            const obj = Object.preventExtensions({a: 1});
            const stats = new Stats(obj);
            Object.defineProperty(stats, "b", {value: 2});
        }).toThrow();
    });
});

describe("Stats.current()", () => {
    it("returns Base initially", () => {
        const stats = new Stats({a: 1});
        expect(stats.current("a")).toBe(stats.base["a"]);
    });

    it("returns Base if not number", () => {
        const stats = new Stats({a: "foo"});
        expect(stats.current("a")).toBe(stats.base["a"]);
    });

    it("returns updated value on change()", () => {
        const stats = new Stats({a: 420});
        const v1 = stats.current("a");
        stats.change("a", 69);
        const v2 = stats.current("a");
        stats.change("a", 1337);
        const v3 = stats.current("");
        expect(v1).toEqual(420);
        expect(v2).toEqual(420 + 69);
        expect(v3).toEqual(420 + 69 + 1337);
    });

    it("returns updated value on Mod Start", () => {
        const stats = new Stats({a: 420});
        const v1 = stats.current("a");
        stats.addMod("a", 69, 1000);
        const v2 = stats.current("a");
        stats.addMod("a", 1337, 1000);
        const v3 = stats.current("a");
        expect(v1).toEqual(420);
        expect(v2).toEqual(420 + 69);
        expect(v3).toEqual(420 + 69 + 1337);
    });

    it.todo("returns updated value on Mod End");

    it.todo("returns updated value on removeMod()");

    it("returns updated value on base mutation", () => {
        const stats = new Stats({a: 1});
        stats.base["a"] = 2;
        expect(stats.current("a")).toBe(2);
    });

    it("accepts params [...keyof base]", () => {
        const base = {};
        for (let i = 0; i < 10000; i++) {
            base["abcd" + i] = i;
        }
        const stats = new Stats(base);
        for (const key in stats.base) expect(stats.current(key)).toBeDefined();
    });
});

describe("Stats.change()", () => {
    it.todo("doesnt mutate base");

    it.todo("mutates diffs");
});

describe("Stats.addMod()", () => {
    it.todo("doesnt mutate base");

    it.todo("mutates mods");
});

describe("Stats.removeMod()", () => {
    it.todo("doesnt mutate base");

    it.todo("mutates mods");
});

describe("Stats.mods", () => {
    it("is readonly", () => {
        const stats = new Stats({a: 1});
        stats.addMod("a", 1, 0);
        expect(() => {
            stats[0] = null;
        }).toThrow();
    });
});
