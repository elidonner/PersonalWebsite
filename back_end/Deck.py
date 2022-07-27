import copy

class Deck():
    '''
    This class returns a deck for a given difficulty choise
    '''
    all_cards = {
        "easy": [1, 2, 3, 4, 5, 6]*3+[7, 8, 9, 10]*4,
        "medium": [11, 12, 13, 14, 15, 16, 17]*2,
        "hard": [18, 19, 20, 21, 22, 23, 24, 25]
    }

    def __init__(self, difficulty):
        '''constructor for deck class'''
        self.difficulty = difficulty
        self.cards = Deck.get_cards(difficulty)

    def get_cards(difficulty):
        '''
        this static method returns the cards based on the difficulty
        '''
        if difficulty == "easy":
            # using dict comprehension to get subdict
            keys = ["easy"]

        elif difficulty == "medium":
            keys = ["easy", "medium"]

        else:
            keys = ["easy", "medium", "hard"]

        # call function to get subdict of all_cards based on difficulty
        cards = Deck.get_subdict(keys, Deck.all_cards)

        return cards

    def get_subdict(keys, dic):
        '''
        this helper method gets subdict given a list of keys
        '''
        # find subdict
        subdict = {key: dic[key] for key in keys}
        #need to make a copy so we don't edit all_cards
        dic_copy = copy.deepcopy(subdict)
        return dic_copy