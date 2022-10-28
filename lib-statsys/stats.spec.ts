import Stats from "./stats.js";


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


test('1 equals 1', () => {
    expect(1).toBe(1);
});
