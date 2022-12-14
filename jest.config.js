/**
 * @format
 * @type {import('ts-jest').JestConfigWithTsJest}
 */

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    testRegex: "((\\.|/)spec)\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testPathIgnorePatterns: ["/node_modules/"],
    detectLeaks: true,
    detectOpenHandles: true,
};
