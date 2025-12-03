module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["./src/tests/setup.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/app.js"],
  coverageDirectory: "coverage",
  verbose: true,
};
