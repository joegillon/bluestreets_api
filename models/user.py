from config.extensions import db
from models.ts_mixin import TimestampMixin


class User(TimestampMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    roles = db.Column(db.Text)
    active = db.Column(
        db.Boolean, default=True, server_default='true')

    @property
    def rolenames(self):
        # noinspection PyBroadException
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @rolenames.setter
    def rolenames(self, roles):
        self.roles = roles

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def identify(cls, user_id):
        return cls.query.get(user_id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.active

