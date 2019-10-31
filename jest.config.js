module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "@api/(.*)": "<rootDir>/src/api/$1",
    "@utils/utils": "<rootDir>/src/utils/utils",
    "@types/(.*)": "<rootDir>/src/types/$1",
    "@generated/(.*)": "<rootDir>/src/generated/$1"
  },
  testRegex: ".*\\.test\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  testPathIgnorePatterns: ["node_modules"],
};