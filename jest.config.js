module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "globals": {
        "Path": {
            "Root": __dirname
        },
        "Separator": {
            "Directory": "/",
            "Expression": ".",
            "Id": "-",
            "Dialogue": "?",
            "Monologue": ":",
            "Namespace": "/",
            "Extension": "."
        }
    }
}