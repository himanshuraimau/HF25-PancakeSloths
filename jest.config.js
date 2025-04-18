module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(chai|@solana/web3.js|@solana/spl-token|@coral-xyz/anchor|chai-as-promised)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/tests/**/*.spec.ts'],
  setupFiles: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^chai$': 'chai/chai.js',
    '^chai-as-promised$': 'chai-as-promised/lib/chai-as-promised.js'
  },
  testEnvironmentOptions: {
    esModuleInterop: true
  },
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
}; 