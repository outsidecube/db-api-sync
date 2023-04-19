module.exports = {
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(t|j)s$',
  testPathIgnorePatterns: ['/__tests__/helper'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
