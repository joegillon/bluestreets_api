#!/usr/bin/python3.6

from flask import Flask
from flask_restful import Api
from config.config import configure_app, configure_api

app = Flask(__name__)

configure_app(app)

api = Api(app)
configure_api(api)

# @app.route('/')
# def hello_world():
#     return 'Hello from Bluestreets!'


# if __name__ == '__main__':

#     app.run(host='0.0.0.0', port=5500)