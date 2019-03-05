from config.setup import db
from models.ts_mixin import TimestampMixin


class Membership(TimestampMixin, db.Model):
    __tablename__ = 'group_members'

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'))
    role = db.Column(db.Text)
    comment = db.Column(db.Text)
