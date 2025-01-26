const EMPTY_HAND = [null, null, null, null, null];
var GameModeDescription;
(function (GameModeDescription) {
    GameModeDescription["PRACTICE"] = "practice";
    GameModeDescription["VERSUS"] = "versus";
    GameModeDescription["COMPUTER"] = "computer";
})(GameModeDescription || (GameModeDescription = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["EASY"] = 0] = "EASY";
    Difficulty[Difficulty["MEDIUM"] = 1] = "MEDIUM";
    Difficulty[Difficulty["HARD"] = 2] = "HARD";
})(Difficulty || (Difficulty = {}));
export { EMPTY_HAND, GameModeDescription, Difficulty };
