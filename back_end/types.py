from dataclasses import dataclass

"""
Module containing custom datatypes and a dataclass for a Krypto game round.

These are made to match types.ts
"""
from typing import Tuple

# Custom Datatypes
FiveCards = Tuple[int, int, int, int, int]
FourOperations = Tuple[str, str, str, str]

@dataclass
class Solution:
    organized_cards: FiveCards
    operations: FourOperations
    max_intermediate_result: int

@dataclass
class KryptoHand:
    starting_hand: FiveCards
    target: int
    solution: Solution
    difficulty_rating: int