module.exports = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['packages/**/*.{ts}'],
    coveragePathIgnorePatterns: ['jest.config.cjs', 'test.ts', '/node_modules/', '/package/', '/dist/', '/src/'],
    roots: ['<rootDir>'],
    testPathIgnorePatterns: ['/node_modules/', '/package/', '/dist/', 'test.ts', '/src/'],
    moduleNameMapper: {
        '^@cere/(.*)/types$': '<rootDir>/src/types',
        '^@cere/(.*)$': '<rootDir>/src',
    },
    testMatch: ['<rootDir>/tests/**/*.spec.ts'],
    transform: {
        '\\.(js|ts)$': require.resolve('babel-jest'),
    },
    globalTeardown: './tests/setup/globalTeardown.cjs',
    globalSetup: './tests/setup/globalSetup.cjs',
    setupFilesAfterEnv: ['./tests/setup/setup.ts'],
    testTimeout: 100000,
};
