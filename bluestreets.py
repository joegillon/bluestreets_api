#!/usr/bin/python3.6

import os
from flask import Flask, render_template
from flask_restful import Api
from config.config import configure_app, configure_api, configure_ui

app = Flask(__name__)

app_path = os.path.dirname(__file__)

configure_app(app)

api = Api(app)
configure_api(api)
configure_ui(app)

@app.route('/')
def homepage():
    return render_template(
        'home.html',
        title='Blue Streets'
    )

@app.route('/test')
def testpage():
    return render_template(
        'test.html',
        title='Test'
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
