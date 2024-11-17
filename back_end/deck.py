import random

from .Solver import Solution, get_solution

EASY_CARDS = [1, 2, 3, 4, 5, 6]*3 + [7, 8, 9, 10]*4
MEDIUM_CARDS = EASY_CARDS + [11, 12, 13, 14, 15, 16, 17]*2
HARD_CARDS = MEDIUM_CARDS + [18, 19, 20, 21, 22, 23, 24, 25]
EASY_RANGE = (min(EASY_CARDS), max(EASY_CARDS)+1)
MEDIUM_RANGE = (min(MEDIUM_CARDS), max(MEDIUM_CARDS)+1)
HARD_RANGE = (min(HARD_CARDS), max(HARD_CARDS)+1)
DIFFICULTY_MAP = {
    'easy': EASY_CARDS,
    'medium': MEDIUM_CARDS,
    'hard': HARD_CARDS
}

class Deck():
    '''
    This class takes a deck of cards and finds a legal hand
    It also creates a difficulty metric
    '''
    #create a deck of cards
    def __init__(self, difficulty) -> None:
        self.difficulty = difficulty
        self.deck = self.deck_init()
        self.hand, self.target, self.solution = self.deal_hand()
        self.difficulty_rating = self.get_difficulty_rating()

    def deck_init(self):
        '''
        This method initializes the deck of cards
        '''
        try:
            return DIFFICULTY_MAP[self.difficulty]
        except KeyError:
            raise ValueError('Invalid difficulty choice.')

    def deal_hand(self)-> tuple[list[int], int, Solution]:
        """
        This method deals random cards from the deck.
        It also checks the cards dealt will have a solution.
        This is also where the target is set
        """

        for _ in range(15):
            target = self.get_random_card()
            hand = self.get_random_hand()
            solution = get_solution(hand, target)
            if solution is not None:
                return hand, target, solution
            self.deck = self.deck_init()
        raise ValueError("Unable to find a valid hand after 15 attempts.")

    def get_random_hand(self):
        """
        returns a hand of five random cards from the deck of cards
        """
        return [self.get_random_card() for _ in range(5)]


    def get_random_card(self):
        """
        get a random card from the deck using random module
        remove that card from the deck
        """
        card = random.choice(self.deck)
        self.deck.remove(card)
        return card


    def get_difficulty_rating(self):
        '''
        get the difficulty rating of the hand
        easy cards are rated 1, medium 2, hard 3
        target card difficulty is multiplied by a factor of 2
        '''
        rating = 2 * self.map_difficulty(self.target)
        for card in self.hand:
            rating += self.map_difficulty(card)
        return rating

    def map_difficulty(self, card):
        '''
        for a given card, find it's difficulty level
        return it's mapped value
        '''
        if card in range(*EASY_RANGE):
            return 1
        elif card in range(*MEDIUM_RANGE):
            return 2
        elif card in range(*HARD_RANGE):
            return 3
        else:
            raise ValueError(f'Invalid card: {card}')
