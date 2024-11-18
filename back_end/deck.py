import random
from dataclasses import dataclass
from typing import Tuple

from .solver import Solution, get_solution

EASY_CARDS = [1, 2, 3, 4, 5, 6] * 3 + [7, 8, 9, 10] * 4
MEDIUM_CARDS = EASY_CARDS + [11, 12, 13, 14, 15, 16, 17] * 2
HARD_CARDS = MEDIUM_CARDS + [18, 19, 20, 21, 22, 23, 24, 25]
EASY_RANGE = (min(EASY_CARDS), max(EASY_CARDS) + 1)
MEDIUM_RANGE = (min(MEDIUM_CARDS), max(MEDIUM_CARDS) + 1)
HARD_RANGE = (min(HARD_CARDS), max(HARD_CARDS) + 1)
DIFFICULTY_MAP = {
    'easy': EASY_CARDS,
    'medium': MEDIUM_CARDS,
    'hard': HARD_CARDS
}

@dataclass
class KryptoHand:
    hand: list[int]
    target: int
    solution: tuple[list[int], list[str]]
    difficulty_rating: int

def deal_hand(difficulty) -> KryptoHand:
    """
    Deals random cards from a deck and ensures the hand has a solution.
    Sets the target card.
    """
    for _ in range(15):
        deck = deck_init(difficulty)
        target = get_random_card(deck)
        hand = get_random_hand(deck)
        solution = get_solution(hand, target)
        if solution is not None:
            return KryptoHand(hand,
                              target,
                              solution.to_tuple(),
                              get_difficulty_rating(hand, target))
    raise ValueError("Unable to find a valid hand after 15 attempts.")

def deck_init(difficulty) -> list[int]:
    '''
    Initializes the deck of cards based on the difficulty.
    '''
    try:
        return DIFFICULTY_MAP[difficulty].copy()
    except KeyError:
        raise ValueError('Invalid difficulty choice.')

def get_random_hand(deck: list[int]) -> list[int]:
    """
    Returns a hand of five random cards from the deck.
    """
    return [get_random_card(deck) for _ in range(5)]

def get_random_card(deck: list[int]) -> int:
    """
    Gets a random card from the deck and removes it.
    """
    card = random.choice(deck)
    deck.remove(card)
    return card

def get_difficulty_rating(hand, target) -> int:
    '''
    Calculates the difficulty rating of the hand.
    Easy cards are rated 1, medium 2, hard 3.
    Target card difficulty is multiplied by a factor of 2.
    '''
    rating = 2 * map_difficulty(target)
    for card in hand:
        rating += map_difficulty(card)
    return rating

def map_difficulty(card: int) -> int:
    '''
    Maps a card to its difficulty level and returns its value.
    '''
    if card in range(*EASY_RANGE):
        return 1
    elif card in range(*MEDIUM_RANGE):
        return 2
    elif card in range(*HARD_RANGE):
        return 3
    else:
        raise ValueError(f'Invalid card: {card}')