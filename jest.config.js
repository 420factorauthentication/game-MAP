/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    testRegex: "((\\.|/)spec)\\.tsx?$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
};
