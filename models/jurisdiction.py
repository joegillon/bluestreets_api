from config.extensions import db


class Jurisdiction(db.Model):
    __tablename__ = 'jurisdictions'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.Text, nullable=False)
    name = db.Column(db.Text, nullable=False)
