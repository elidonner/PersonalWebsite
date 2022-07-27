from itertools import permutations
from itertools import product

class Solver():
    '''
    This class looks at a given hand and target and determines if it is solvable
    It contains:
    boolean (solvable)
    dict (solution)
    int (difficulty)
    '''

    def __init__(self, hand, target):
        self.solvable = True
        self.hand = list(hand.values())
        self.target = target
        self.solution = self.get_solution()


    def get_solution(self):
        '''
        This function returns the simplest solution
        if there is one
        '''
        #get all the solutions
        solutions = self.get_solutions()

        #see if there is a solution
        if len(solutions)<1:
            self.solvable = False
            return None
        else:
            simplest_solution = Solver.get_simplest_solution(solutions)
            return(simplest_solution)
    

    def get_solutions(self):
        '''
        this function finds all the solutions
        '''
        #first, I get a list of all the permutations of our cards using itertools
        list_permutations = permutations(self.hand, 5)

        #next, I get a list of the cartesian product of all operations
        #this will be a list of possible combos of operations, with repetition up to four allowed
        list_operations = list(product(["+", "-", "*", "/"], repeat=4))

        #now, I iterate through this list, and call each possible list of operations on every permutation of the hand
        #if the operations return the target, we add it to the list of solutions
        solutions = []
        for permutation in list_permutations:
            for operations in list_operations:
                if(self.valid_solution(permutation, operations)):
                    solutions.append((permutation, operations))

        return solutions

    def valid_solution(self, hand, operations):
        '''
        checks a given hand and set of operations
        returns true if they produce the target
        '''
        #iterate through the list of operations and see if it is equal to the target
        # also makes sure we eliminate fractions or negatives, which are not allowed
        valid = True
        solution = hand[0]
        i = 1
        for operation in operations:
            #call function that performs operation from string operation
            solution = Solver.map_ops(solution, hand[i], operation)
            #check if the solution is positive and whole number
            if solution < 0:
                valid = False
                break
            elif not isinstance(solution, int):
                if(solution.is_integer()):
                    solution = int(solution)
                else:
                    valid = False
                    break
            i+=1
        
        if valid ==True and solution != self.target:
            valid = False
        
        return valid


    def get_simplest_solution(solutions):
        '''
        finds "simplest solution"
        simplest solutions is the solution that creates the smalles number in finding the solution
        '''
        #find the max_interim_numbers
        list_max_vals=[]
        for solution in solutions:
            list_max_vals.append(Solver.max_interim_number(solution) )
        
        #find the solution that corresponds to the minimum of these maxes
        min_of_maxes = min(list_max_vals)
        i = list_max_vals.index(min_of_maxes)

        return solutions[i]

    def max_interim_number(solution):
        '''
        for a given solution, find the max number it uses to find the target number
        solution is a list of tuples(2), tuple(0) is the hand, tuple(1) is the operations
        '''
        hand = solution[0]
        operations = solution[1]
        max_val = iterim_solution= hand[0]
        #do minus 1 the length, because we don't care if the target is the max number, they all have to get there
        for i in range(len(operations)-1):
            iterim_solution = Solver.map_ops(iterim_solution, hand[i+1], operations[i])
            if iterim_solution > max_val:
                max_val = iterim_solution
            i+=1
        
        return max_val

    def map_ops(num1, num2, operation):
        '''
        Given two numbers and an operation, as a string, return the value of the operations
        '''
        if operation == "+":
            value = num1 + num2
        if operation == "-":
            value = num1 - num2
        if operation == "*":
            value = num1 * num2
        if operation == "/":
            value = num1 / num2
        return value