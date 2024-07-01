'''
This is the main file that actually runs the Krypto game
It uses a package called flask, which handles interactions between server and client side
Running this file (calling app.run()), should set up a local server for development
'''

import sys
from json import dumps

from flask import Flask, render_template, request

import back_end

app = Flask(__name__)
app.debug = True

#this sets up the connection to the client side using the current url "/"
@app.route("/", methods=['GET', 'POST'])

def index():
    '''
    when a request is received from the client (in the do_ajax() function)
    This calls our back_end code which finds a krypto hand with a valid solution
    for the given difficulty level
    '''

    if request.method == "POST":
        #get the difficulty of the request
        difficulty = request.form["difficulty"]

        #call the back end to create the hand with given difficulty
        info = back_end.Run.run(difficulty)


        #return the info for the game as a json file, which can be parsed in javascript
        return dumps(info)

    #this renders the html file from within the templates folder
    return render_template("index.html")

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/krypto')
def Krypto():
    return render_template('projects/krypto.html')

@app.route('/dove')
def Dove():
    return render_template('projects/dove.html')

@app.route('/ollie')
def Ollie():
    return render_template('projects/ollie.html')

@app.route('/deka')
def DEKA():
    return render_template('projects/deka.html')

@app.route('/circuits')
def Circuits():
    return render_template('projects/circuits.html')

@app.route('/corolla')
def Toyota ():
    return render_template('projects/corolla.html')

if __name__ == "__main__":
   app.run(host='0.0.0.0')