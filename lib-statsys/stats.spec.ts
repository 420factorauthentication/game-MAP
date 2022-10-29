/** @format */

import Stats from "./stats";

jest.setTimeout(1000);

describe("A Stats instance", () => {
    beforeEach(() => {
        console.info = jest.fn();
        console.warn = jest.fn();
        console.error = jest.fn();
    });

    it("should be unextensible", () => {
        const stats = new Stats({a: 1});
        expect(() => {
            Object.defineProperty(stats, "newProp", {
                value: 42,
            });
        }).toThrow();
    });

    describe(".mods: StatMod[]", () => {
        it("should be readonly", () => {
            const stats = new Stats({a: 1});
            stats.addMod("a", 1, 0);
            expect(() => {
                stats[0] = null;
            }).toThrow();
        });
    });

    describe(".base: object", () => {
        it("should be writable", () => {
            let stats = new Stats({a: 1});
            expect(() => {
                stats.base = {b: 2};
                (stats.base as {b: number}).b = 3;
            }).not.toThrow();
            expect(() => {
                let newBase = {c: 3};
                stats.base = newBase;
                newBase.c = 4;
            }).not.toThrow();
        });

        it("should be a handle to constructor param", () => {
            type baseType = {a: number};
            let base: baseType = {a: 1};
            const stats = new Stats(base);
            expect((stats.base as baseType).a).toBe(1);
            base.a = 2;
            expect((stats.base as baseType).a).toBe(2);
            base = {a: 3};
            expect((stats.base as baseType).a).toBe(2);
        });
    });

    describe(".current(key)", () => {
        it("should work with every key of this.base", () => {
            const stats = new Stats({a: 1, b: "test", c: true});
            for (const key in stats.base)
                expect(stats.current(key)).toBeDefined();
        });

        it("should initially return this.base[key]", () => {
            const stats = new Stats({a: 1});
            expect(stats.current("a")).toBe(1);
        });

        it("should return newBase[key] if stats.base is changed", () => {
            const stats = new Stats({a: 1});
            stats.base = {a: 2};
            expect(stats.current("a")).toBe(2);
        });
    });
});
