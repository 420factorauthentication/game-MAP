/** @format */

import Stats from "./stats.js";

jest.setTimeout(1000);

// describe("Stats constructor", () => {
//     beforeEach(() => {
//         console.info = jest.fn();
//         console.warn = jest.fn();
//         console.error = jest.fn();
//     });

//     it("Should have immutable function properties"), () => {};
// });

// Test mutability //
// const stats = new Stats({a: 1, b: 2,});

// try {
//     stats.change("a", 4);
//     console.log(stats.current("a"));
// } catch (e) {console.log(e);}

// try {
//     Object.defineProperty(stats, "test", {
//         value: 42,
//     });
// } catch (e) {console.log(e);}

// try {
//     stats.base = {a: 3, b: 4,}
//     console.log(stats.current("a"));
// } catch (e) {console.log(e);}
