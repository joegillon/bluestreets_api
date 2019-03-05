from flask import Flask


def create_app():
    from config.setup import db, guard, cors, is_blacklisted
    from resources.contacts import con_api
    from resources.precincts import pct_api
    from resources.groups import grp_api
    from resources.memberships import mem_api
    from resources.users import usr_api
    from models.user import User

    the_app = Flask(__name__)
    the_app.config['DEBUG'] = True
    the_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/26161.db'
    the_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    the_app.config['SECRET_KEY'] = 'top secret'
    the_app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
    the_app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}

    db.init_app(the_app)
    guard.init_app(the_app, User, is_blacklisted=is_blacklisted)
    cors.init_app(the_app)

    the_app.register_blueprint(con_api)
    the_app.register_blueprint(pct_api)
    the_app.register_blueprint(grp_api)
    the_app.register_blueprint(mem_api)
    the_app.register_blueprint(usr_api)

    return the_app


def create_api(the_app):
    from flask_restful import Api
    from resources.contacts import Contacts, ContactsSince
    from resources.precincts import Precincts
    from resources.groups import Groups
    from resources.memberships import Memberships
    from resources.users import (
        UserRegistration, Login, Refresh, Blacklist
    )

    the_api = Api(the_app)

    the_api.add_resource(Contacts, '/con_api/all')
    the_api.add_resource(ContactsSince, '/con_api/since/<int:pct_id>')
    the_api.add_resource(Precincts, '/pct_api/all')
    the_api.add_resource(Groups, '/grp_api/all')
    the_api.add_resource(Memberships, '/mem_api/all')
    the_api.add_resource(UserRegistration, '/usr_api/new')
    the_api.add_resource(Login, '/usr_api/login')
    the_api.add_resource(Refresh, '/usr_api/refresh')
    the_api.add_resource(Blacklist, '/usr_api/blacklist')

    return the_api

if __name__ == '__main__':
    import os

    app_path = os.path.dirname(__file__)

    app = create_app()
    api = create_api(app)

    app.run(debug=True)
