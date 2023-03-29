module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		"^.+\\.(ts|tsx)$": "babel-jest",
	},
	globals: {
		"ts-jest": {
			babelConfig: true,
		},
	},
	moduleFileExtensions: ["ts", "tsx", "js"],
}
