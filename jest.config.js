// force timezone to UTC to allow tests to work regardless of local timezone
// generally used by snapshots, but can affect specific tests
process.env.TZ = 'UTC';

const scaffoldConfig = require('./.config/jest.config');

module.exports = {
  // Jest configuration provided by Grafana scaffolding
  ...scaffoldConfig,
  // d3's `main` entry is ESM-only; map it to the prebuilt UMD bundle so Jest can load it
  // without transforming d3's many nested submodules (e.g. d3-array) missed by the scaffold.
  moduleNameMapper: {
    ...scaffoldConfig.moduleNameMapper,
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
};
