import logging


class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = '1d94e52c-1c89-4515-b87a-f48cf3cb7f0b'
    LOGGING_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    LOGGING_LEVEL = logging.DEBUG
    JWT_ACCESS_LIFESPAN = {}
    JWT_REFRESH_LIFESPAN = {}


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    ENV = 'prod'
    SECRET_KEY = '792842bc-c4df-4de1-9177-d5207bd9faa6'
    JWT_ACCESS_LIFESPAN = {'hours': 24}
    JWT_REFRESH_LIFESPAN = {'days': 30}


class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False
    ENV = 'dev'
    SECRET_KEY = 'a9eec0e0-23b7-4788-9a92-318347b9a39f'
    JWT_ACCESS_LIFESPAN = {'hours': 24}
    JWT_REFRESH_LIFESPAN = {'days': 30}


config = {
    'dev': 'config.config.DevelopmentConfig',
    'prod': 'config.config.ProductionConfig',
    'default': 'config.config.DevelopmentConfig'
}


def configure_app(app):
    import os
    from config.extensions import db, guard, cors, is_blacklisted, JSGlue
    from resources.contacts import con_api
    from resources.precincts import pct_api
    from resources.groups import grp_api
    from resources.memberships import mem_api
    from resources.users import usr_api
    from models.user import User

    config_name = os.getenv('FLASK_CONFIGURATION', 'default')
    fips = os.getenv('BLUESTREETS_FIPS', '')
    fips = '26161'
    app.config.from_object(config[config_name])
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/%s.db' % (fips,)
    print(app.config['SQLALCHEMY_DATABASE_URI'])
    # app.config.from_pyfile('config.cfg', silent=True)

    # app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    # handler = logging.FileHandler('%s/bluestreets.log' % (app_path,))
    # handler.setLevel(app.config['LOGGING_LEVEL'])
    # handler.setFormatter(logging.Formatter(app.config['LOGGING_FORMAT']))
    # app.logger.addHandler(handler)

    db.init_app(app)
    guard.init_app(app, User, is_blacklisted=is_blacklisted)
    cors.init_app(app)
    jsglue = JSGlue(app)

    app.register_blueprint(con_api)
    app.register_blueprint(pct_api)
    app.register_blueprint(grp_api)
    app.register_blueprint(mem_api)
    app.register_blueprint(usr_api)


def configure_api(api):
    from resources.contacts import Contacts, ContactsSince
    from resources.precincts import Precincts
    from resources.groups import Groups
    from resources.memberships import Memberships
    from resources.users import (
        UserRegistration, Login, Refresh, Blacklist
    )

    api.add_resource(Contacts, '/con_api/all')
    api.add_resource(ContactsSince, '/con_api/since/<string:datestr>')
    api.add_resource(Precincts, '/pct_api/all')
    api.add_resource(Groups, '/grp_api/all')
    api.add_resource(Memberships, '/mem_api/all')
    api.add_resource(UserRegistration, '/usr_api/new')
    api.add_resource(Login, '/usr_api/login')
    api.add_resource(Refresh, '/usr_api/refresh')
    api.add_resource(Blacklist, '/usr_api/blacklist')


def configure_ui(app):
    from views.contacts import con
    from views.groups import grp
    from views.memberships import mem
    # from views.users import usr

    app.register_blueprint(con)
    app.register_blueprint(grp)
    app.register_blueprint(mem)
    # app.register_blueprint(usr)
