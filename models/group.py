from config.setup import db
from models.ts_mixin import TimestampMixin


class Group(TimestampMixin, db.Model):
    __tablename__ = 'groups'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    code = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
