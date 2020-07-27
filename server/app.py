from io import BytesIO

import requests
from flask import Flask, request, json, jsonify, render_template
from flask_cors import CORS, cross_origin
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Uncomment this line if you are making a Cross domain request
# CORS(app)

userEvents = {}
userPositions = {}

@app.route('/')
def index():
    return render_template('index.html')

# Testing URL
@app.route('/hello/', methods=['GET', 'POST'])
def hello_world():
    return 'Hello, World!'


@app.route('/log/', methods=['POST'])
@cross_origin()
def log():
    # Decoding and pre-processing base64 image
    payload = request.json
    # print(payload)
    date = datetime.today().strftime('%Y-%m-%d')
    logfile = date + "_" + payload["targetCategory"] + '_' + payload['username'] + ".json"
    with open(logfile, "a") as writer:
        json.dump(payload, writer)

    # if payload['signature_name'] == 'occlusion':
    #     content = {"outputs": {0: generate_occlusion()}}
    # else: 
    #     r = requests.post('http://localhost:8501/v1/models/' + payload['signature_name']  + ':predict', json=payload)
    #     content = json.loads(r.content.decode('utf-8'))
    
    # Decoding results from TensorFlow Serving server
    # output = json.loads(r.content.decode('utf-8'))

    # Returning JSON response to the frontend
    # return jsonify(content)
    return "QWQ"


@app.route('/event/', methods=['POST'])
@cross_origin()
def event():
    # Decoding and pre-processing base64 image
    payload = request.json
    # print(payload)
    username = payload["username"]
    event = payload["event"]

    if username not in userEvents:
        userEvents[username] = [event]
    else:
        userEvents[username].append(event)

    # print(userEvents[username])
    return "QWQ"

@app.route('/events/', methods=['POST'])
@cross_origin()
def events():
    # Decoding and pre-processing base64 image
    events = request.json
    print(len(events))
    for e in events:
        username = e["username"]
        event = e["event"]
        if username not in userEvents:
            userEvents[username] = [event]
        else:
            userEvents[username].append(event)

    # print(userEvents[username])
    return "QWQ"

@app.route('/positions/', methods=['POST'])
@cross_origin()
def positions():
    # Decoding and pre-processing base64 image
    events = request.json
    print(len(events))
    # print(payload)
    for e in events:
        username = e["username"]
        event = e["event"]
        if username not in userPositions:
            userPositions[username] = [event]
        else:
            userPositions[username].append(event)

    # print(userEvents[username])
    return "QWQ"

@app.route('/finish/', methods=['POST'])
@cross_origin()
def finish():
    # Decoding and pre-processing base64 image
    payload = request.json
    # print(payload)
    username = payload["username"]
    events = userEvents[username]
    date = datetime.today().strftime('%Y-%m-%d')
    logfile = date + "_" + payload["targetCategory"] + '_event_' + username + ".json"
    with open(logfile, "a") as writer:
        json.dump(events, writer)

    positions = userPositions[username]
    logfile2 = date + "_" + payload["targetCategory"] + '_position_' + username + ".json"
    with open(logfile2, "a") as writer:
        json.dump(positions, writer)

    userEvents[username] = []
    userPositions[username] = []
    return "QWQ"