def create_app():
    from dao.setup import db
    from resources.contacts import con_api
    from resources.precincts import pct_api
    from resources.groups import grp_api
    from resources.memberships import mem_api

    the_app = Flask(__name__)
    the_app.config['DEBUG'] = True
    the_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/26161.db'
    the_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(the_app)

    the_app.register_blueprint(con_api)
    the_app.register_blueprint(pct_api)
    the_app.register_blueprint(grp_api)
    the_app.register_blueprint(mem_api)

    return the_app


def create_api(the_app):
    from flask_restful import Api
    from resources.contacts import Contacts, ContactsSince
    from resources.precincts import Precincts
    from resources.groups import Groups
    from resources.memberships import Memberships

    the_api = Api(the_app)

    the_api.add_resource(Contacts, '/con_api/all')
    the_api.add_resource(ContactsSince, '/con_api/since/<int:pct_id>')
    the_api.add_resource(Precincts, '/pct_api/all')
    the_api.add_resource(Groups, '/grp_api/all')
    the_api.add_resource(Memberships, '/mem_api/all')

    return the_api


if __name__ == '__main__':
    import os
    from flask import Flask

    app_path = os.path.dirname(__file__)

    app = create_app()
    api = create_api(app)

    app.run(debug=True)
