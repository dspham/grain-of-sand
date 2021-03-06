#!/usr/bin/python3
""" api module """

from flask import Flask, jsonify, request
from flask_cors import CORS
import re
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
import json

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})


here = requests.Session()
words = requests.Session()
words.params = {"key": "VP9JUPVY", "display": "terse"}
here.params = {"app_id": "7DZj4FZSRWbx6FTL8JER",
               "app_code": "9SXulP-IrrM3ZJnMBwBHLQ",
               "maxresults": "1",
               "language": "en"}

@app.route('/api/<query>', methods=['GET'])
def convert(query):
    """ tests query and converts """
    if re.match("^\w*\.\w*\.\w*$", query):
        string = query
        query = words.get('https://api.what3words.com/v2/forward?addr=' + string).json()
        if query.get("status").get("code"):
            try:
                query = words.get('https://api.what3words.com/v2/autosuggest?count=1&addr=' + string).json()
                query = query.get("suggestions")[0]
            except:
                return ("bad")
        w = query.get("words")
        coord = query.pop("geometry")
        data = {"prox": "{},{},500".format(coord.get("lat"), coord.get("lng")),
                "mode": "retrieveAddresses",
                "maxresults": 1}
        query = here.get('https://reverse.geocoder.api.here.com/6.2/reversegeocode.json', params=data)
        print(query.url)
        query = query.json()
        try:
            query = query.pop("Response").pop("View")[0].pop("Result")[0].pop("Location")
            coord = query.pop("DisplayPosition")
            address = query.pop("Address").pop("Label")
        except:
            return ("bad")

    else:
        query = here.get('https://geocoder.api.here.com/6.2/search.json?searchtext=' + query)
        print(query.url)
        query = query.json()
        coord = {}
        try:
            query = query.pop("Response").pop("View")[0].pop("Result")[0]
            if query.get("MatchQuality").get("Name"):
                coord.update({"Name": query.get("Place").pop("Name")})
                query = query.get("Place").pop("Locations")[0]
            else:
                query = query.pop("Location")
            address = query.pop("Address").pop("Label")
            coord.update(**query.pop("DisplayPosition"))
        except:
            return ("bad")
        data = {"coords": "{},{}".format(coord.get("Latitude"), coord.get("Longitude"))}
        query = words.get('https://api.what3words.com/v2/reverse', params=data).json()
        w = query.get("words")

    coord.update({"Address": address, "Words": w})
    return jsonify(coord)

@app.route('/api/verify', methods=['POST'])
def verify():
    token = request.get_json(silent=True)
    print (token)
    print (type(token))
    print('EXTRA LINE') 

    # try:
    # Specify the CLIENT_ID of the app that accesses the backend:
    idinfo = id_token.verify_oauth2_token(token, grequests.Request(), '550246531979-58rjevftor5s8knchrflgi2fevn04ud6.apps.googleusercontent.com')
    print('TEST')
    print (idinfo)

    # Or, if multiple clients access the backend server:
    # idinfo = id_token.verify_oauth2_token(token, requests.Request())
    # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
    #     raise ValueError('Could not verify audience.')

    if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
        raise ValueError('Wrong issuer.')

    # If auth request is from a G Suite domain:
    # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
    #     raise ValueError('Wrong hosted domain.')

    # ID token is valid. Get the user's Google Account ID from the decoded token.
    userid = idinfo['sub']
    print(userid)
    return (jsonify("OK"), 201)
    # except ValueError:
    #     # Invalid token
    #     return jsonify("bad"), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
