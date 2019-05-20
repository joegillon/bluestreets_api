from flask_testing import TestCase
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models.contact import Contact


class TestContact(TestCase):

    def create_app(self):
        path = 'c:\\bench\\bluestreets\\data\\26161.db'
        app = Flask(__name__)
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///%s' % (path,)
        self.db = SQLAlchemy(app)
        return app

    def setUp(self):
        # self.db = SQLAlchemy(self.app)
        pass

    def tearDown(self):
        pass

    def testGetFromDB(self):
        contacts = Contact.get_missing_pct()
        pass