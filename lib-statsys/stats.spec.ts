/** @format */

import Stats from "./stats";

jest.setTimeout(1000);

const flushPromises = () =>
    new Promise(jest.requireActual("timers").setImmediate);

/////////////////////////////////////////////////////////////////////////////
// To fix tests with timeouts/intervals within promises, or vice versa:    //
//   insert "await flushPromises();" after each jest.advanceTimers()       //
// SOURCE:                                                                 //
//   https://gist.github.com/apieceofbart/e6dea8d884d29cf88cdb54ef14ddbcc4 //
/////////////////////////////////////////////////////////////////////////////

describe("A STATS INSTANCE", () => {
    it("is not extensible", () => {
        const stats = new Stats({a: 1});
        expect(() => {
            Object.defineProperty(stats, "newProp", {value: 42});
        }).toThrow();
    });
});

describe("STATS.BASE", () => {
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
            Object.defineProperty(stats.base, "b", {value: 2});
        }).not.toThrow();
        expect(() => {
            const obj = Object.preventExtensions({a: 1});
            const stats = new Stats(obj);
            Object.defineProperty(stats.base, "b", {value: 2});
        }).toThrow();
    });
});

describe("STATS.CURRENT()", () => {
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
        expect(stats.current("a")).toEqual(420);
        stats.change("a", 69);
        expect(stats.current("a")).toEqual(420 + 69);
        stats.change("a", 1337);
        expect(stats.current("a")).toEqual(420 + 69 + 1337);
    });

    it("returns updated value on Mod Start", () => {
        jest.useFakeTimers();
        const stats = new Stats({a: 420});
        expect(stats.current("a")).toEqual(420);
        stats.addMod("a", 69, 0);
        expect(stats.current("a")).toEqual(420 + 69);
        stats.addMod("a", 1337, 2222);
        expect(stats.current("a")).toEqual(420 + 69 + 1337);
        jest.runAllTimers();
    });

    it("returns updated value on Mod End", () => {
        jest.useFakeTimers();
        const stats = new Stats({a: 420});
        const promise = stats.addMod("a", 69, 2222)[1].then((data) => {
            expect(data).toStrictEqual(true);
            expect(stats.current("a")).toEqual(420);
        });
        jest.runAllTimers();
        return promise;
    });

    it("returns updated value on Mod Remove", async () => {
        jest.useFakeTimers();
        const stats = new Stats({a: 420});
        const uuid0 = stats.addMod("a", 21, 555)[0];
        const uuid1 = stats.addMod("a", 69, 2222)[0];
        const uuid2 = stats.addMod("a", 1337, 2222)[0];
        jest.advanceTimersByTime(444);
        await flushPromises();
        expect(stats.current("a")).toBe(420 + 21 + 69 + 1337);
        stats.removeMod(uuid1);
        expect(stats.current("a")).toBe(420 + 21 + 1337);
        jest.advanceTimersByTime(444);
        await flushPromises();
        expect(stats.current("a")).toBe(420 + 1337);
        jest.runAllTimers();
    });

    it("returns updated value on base mutation", () => {
        const stats = new Stats({a: 1});
        stats.base["a"] = 2;
        expect(stats.current("a")).toBe(2);
    });

    it("accepts args [...keyof base]", () => {
        const base = {};
        for (let i = 0; i < 10000; i++) {
            base["abcd" + i] = i;
        }
        const stats = new Stats(base);
        for (const key in stats.base) expect(stats.current(key)).toBeDefined();
    });
});

describe("STATS.MODS", () => {
    it("is readonly", () => {
        const stats = new Stats({a: 1});
        expect(() => {
            stats.mods["foo"] = 2;
        }).toThrow();
    });

    it("is properly updated on Mod Start", () => {
        jest.useFakeTimers();
        const stats = new Stats({a: 1});
        expect(stats.mods[0]).toBeUndefined();
        stats.addMod("a", 1, 2222);
        expect(stats.mods[0]).toBeDefined();
        jest.runAllTimers();
    });

    it("is properly updated on Mod End", () => {
        jest.useFakeTimers();
        const stats = new Stats({a: 1});
        const promise = stats.addMod("a", 1, 2222)[1].then((data) => {
            expect(data).toStrictEqual(true);
            expect(stats.mods[0]).toBeUndefined();
        });
        jest.runAllTimers();
        return promise;
    });

    it("is properly updated on Mod Remove", async () => {
        jest.useFakeTimers();
        const stats = new Stats({a: 420});
        const uuid0 = stats.addMod("a", 69, 2222)[0];
        const uuid1 = stats.addMod("a", 1337, 2222)[0];
        jest.advanceTimersByTime(1111);
        await flushPromises();
        stats.removeMod(uuid0);
        expect(stats.mods[0]).toBeDefined();
        expect(stats.mods[1]).toBeUndefined();
        jest.runAllTimers();
    });
});
