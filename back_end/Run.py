from dataclasses import asdict

from . import Deck


def run(difficulty):
    '''
    Create a legal hand based on the desired difficulty
    return:
    random hand
    target card
    solution
    difficulty_rating
    '''
    deck = Deck(difficulty)

    info = {
        "hand": deck.hand,
        "target": deck.target,
        "solution": deck.solution.to_tuple(),
        "difficulty_rating": deck.difficulty_rating
        }

    return info
