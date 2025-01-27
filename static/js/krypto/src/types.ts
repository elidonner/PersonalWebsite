// Types
type FiveCards = [number, number, number, number, number];
type OptionalCard = number | null;
type FiveOptionalCards = [
  OptionalCard,
  OptionalCard,
  OptionalCard,
  OptionalCard,
  OptionalCard
];
const EMPTY_HAND: FiveOptionalCards = [null, null, null, null, null];
type Operation = "+" | "-" | "*" | "×" | "÷" | "/";
type FourOperations = [Operation, Operation, Operation, Operation];
enum GameModeDescription {
  PRACTICE = "practice",
  VERSUS = "versus",
  COMPUTER = "computer",
}
enum Difficulty {
  EASY,
  MEDIUM,
  HARD,
}
type GameInfo = {
  mode_description: GameModeDescription;
  difficulty: Difficulty;
};
type Solution = {
  organized_cards: FiveCards;
  operations: FourOperations;
  max_intermediate_result: number;
};
type KryptoHand = {
  starting_hand: FiveCards;
  target: number;
  solution: Solution;
  difficulty_rating: number;
};

class RoundInfo {
  krypto_hand: KryptoHand;
  steps: FiveOptionalCards[];

  constructor(krypto_hand: KryptoHand) {
    this.krypto_hand = krypto_hand;
    this.steps = [this.krypto_hand.starting_hand];
  }
}

export { EMPTY_HAND, GameModeDescription, Difficulty, RoundInfo };

export type {
  FiveCards,
  FiveOptionalCards,
  OptionalCard,
  GameInfo,
  Solution,
  KryptoHand,
};
