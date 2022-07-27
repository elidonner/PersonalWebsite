from . import Solver
from . import Hand

def run(difficulty):
    '''
    Create a legal hand based on the desired difficulty
    return:
    random hand
    target card
    solution
    difficulty_rating
    '''
    hand = Hand(difficulty)
    solver = Solver(hand.cards, hand.target)

    info = {
        "hand": hand.cards, 
        "target": hand.target,
        "solution": solver.solution,
        "difficulty_rating": hand.difficulty_rating
        }
    
    return info
