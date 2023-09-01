
module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src/'],
    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
    moduleDirectories: ['src', 'node_modules'],
    coveragePathIgnorePatterns: [
        "<rootDir>/node_modules",
        "<rootDir>/src/test",
        "<rootDir>/src/environment",
        "<rootDir>/src/scripts"
    ],
};
