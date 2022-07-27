import random
from . import Deck
from . import Solver

class Hand():
    '''
    This class takes a deck of cards and finds a legal hand
    It also creates a difficulty metric
    '''
    #create a deck of cards
    def __init__(self, difficulty):
        self.difficulty = difficulty
        self.target = None
        self.deck = self.deck_init()
        self.cards = self.deal_cards()
        self.difficulty_rating = self.get_difficulty_rating()


    def deck_init(self):
        '''this iniitiates a deck object and then returns the cards from it'''
        deck = Deck(self.difficulty)
        return deck.cards


    def deal_cards(self):
        """
        This method deals random cards from the deck.
        It also checks the cards dealt will have a solution.
        This is also where the target is set
        """
        #take a hand from the deck
        self.target = self.get_random_card()
        hand = self.get_random_hand()
        #check if the hand has a solution
        while(not Solver(hand, self.target).solvable):
            #if the hand doesn't have a solution
            #create a new deck and get a new hand
            self.deck = self.deck_init()
            self.target = self.get_random_card()
            hand = self.get_random_hand()
        return hand


    def get_random_hand(self):
        """
        returns a hand of five random cards from the deck of cards
        """
        hand = {}
        for i in range(1,6):
            hand.update({i: self.get_random_card()})
        return hand

    def get_random_card(self):
        """
        get a random card from the deck using random module
        remove that card from the deck
        """
        #convert the dictionary into a list of cards
        cards=[]
        for lst in list(self.deck.values()):
            for c in lst:
                cards.append(c)
        
        #get a random card from this list
        card = random.choice(cards)

        #take this card out of the deck
        found = False
        for value in self.deck.values():
            for elem in value:
                if elem == card:
                    value.remove(elem)
                    found = True
                    break
            if found == True:
                break

        return card

    def get_difficulty_rating(self):
        '''
        this method returns how many of the numbers are hard, medium, or easy, and assigns a difficulty rating
        hard are given value of 3, medium a value of 2, and easy a value of 1
        The target card is given a rating of 2
        '''
        rating = 2 * self.map_difficulty(self.target)
        for card in self.cards:
            rating += self.map_difficulty(card)
        return rating

    def map_difficulty(self, card):
        '''
        for a given card, find it's difficulty level
        return it's mapped value
        '''
        if card in Deck.all_cards["easy"]:
            return 1
        elif card in Deck.all_cards["medium"]:
            return 2
        elif card in Deck.all_cards["hard"]:
            return 3


