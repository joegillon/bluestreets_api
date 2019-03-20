import flask_sqlalchemy
import flask_praetorian
import flask_cors
from flask_jsglue import JSGlue

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()

blacklist = set()


def is_blacklisted(jti):
    return jti in blacklist
