from dataclasses import dataclass
from itertools import permutations, product

# a list of the cartesian product of all operations
# this will be a list of possible combos of operations
# with repetition up to four allowed for the 5 cards in a hand
POSSIBLE_OPERATIONS = list(product(["+", "-", "*", "/"], repeat=4))
operations = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a / b if b != 0 else float('inf')
}

@dataclass
class Solution:
    organized_cards: list[int]
    operations: list[str]
    max_interim_number: int

    def to_tuple(self):
        return (self.organized_cards, self.operations)

def get_solution(hand: list[int], target: int) -> Solution | None:
    '''
    This function returns the simplest solution
    if there is one
    '''
    #get all the solutions
    solutions = get_solutions(hand, target)

    if len(solutions) == 0:
        return None

    simplest_solution = get_simplest_solution(solutions)
    return(simplest_solution)


def get_solutions(hand: list[int], target: int) -> list[Solution] | None:
    '''
    this function finds all the solutions
    '''
    #first, I get a list of all the permutations of our cards using itertools
    list_permutations = permutations(hand, 5)

    #now, I iterate through this list, and call each possible list of operations on every permutation of the hand
    #if the operations return the target, we add it to the list of solutions
    solutions:list[Solution] = []
    for permutation in list_permutations:
        for operations in POSSIBLE_OPERATIONS:
            solution = valid_solution(permutation, operations, target)
            if solution is not None:
                solutions.append(solution)

    return solutions

def valid_solution(hand: list[int], operations: list[str], target: int, max_required_num:int = 75) -> Solution | None:
    '''
    checks a given hand and set of operations
    returns true if they produce the target
    optional: max_interim_number is the maximum number possible required to get to the soluton
    '''
    #iterate through the list of operations and see if it is equal to the target
    # also makes sure we eliminate fractions or negatives, which are not allowed
    value = max_value = hand[0]
    for i, operation in enumerate(operations, start=1):
        #call function that performs operation from string operation
        value = map_ops(value, hand[i], operation)
        if value < 0 or not value.is_integer() or value > max_required_num:
            return None
        max_value = max(max_value, int(value))

    if value == target:
        return Solution(organized_cards=hand, operations=operations, max_interim_number=max_value)


def get_simplest_solution(solutions: list[Solution]) -> Solution:
    '''
    finds "simplest solution"
    simplest solutions is the solution that creates the smallest number in finding the solution
    '''
    return min(solutions, key=lambda sol: sol.max_interim_number)


def map_ops(num1, num2, operation) -> float:
    '''
    Given two numbers and an operation, as a string, return the value of the operations
    '''
    try:
        func = operations.get(operation)
        if func is None:
            raise ValueError(f"Invalid operation: {operation}")
        return float(func(num1, num2))
    except Exception as e:
        raise ValueError(f"Error performing operation {operation} on {num1} and {num2}: {e}")
