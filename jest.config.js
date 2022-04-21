const { pathsToModuleNameMapper } = require("ts-jest/utils");

const tsconfig = require("./tsconfig.base.json");

const moduleNameMapper = {
  ...{
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/imageMock.js",
    "\\.css$": "<rootDir>/__mocks__/cssMock.js",
  },
  ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};

module.exports = {
  cacheDirectory: ".jestcache",
  moduleNameMapper,
  setupFiles: ["./jest.setup.js"],
  setupFilesAfterEnv: ["./jest.setupAfterEnv.js"],
};
