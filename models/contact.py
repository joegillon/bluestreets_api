from config.extensions import db
from models.ts_mixin import TimestampMixin


class Contact(TimestampMixin, db.Model):
    __tablename__ = 'contacts'

    id = db.Column(db.Integer, primary_key=True)
    last_name = db.Column(db.Text, nullable=False)
    first_name = db.Column(db.Text, nullable=False)
    middle_name = db.Column(db.Text)
    name_suffix = db.Column(db.Text)
    nickname = db.Column(db.Text)
    last_name_meta = db.Column(db.Text, nullable=False)
    first_name_meta = db.Column(db.Text)
    nickname_meta = db.Column(db.Text)
    birth_year = db.Column(db.Integer)
    gender = db.Column(db.Text)
    email = db.Column(db.Text)
    phone1 = db.Column(db.Text)
    phone2 = db.Column(db.Text)
    house_number = db.Column(db.Integer)
    pre_direction = db.Column(db.Text)
    street_name = db.Column(db.Text)
    street_type = db.Column(db.Text)
    suf_direction = db.Column(db.Text)
    unit = db.Column(db.Text)
    street_name_meta = db.Column(db.Text)
    city = db.Column(db.Text)
    zipcode = db.Column(db.Text)
    precinct_id = db.Column(db.Integer)
    voter_id = db.Column(db.Integer)
    reg_date = db.Column(db.Text)
    active = db.Column(db.Boolean)
    comment = db.Column(db.Text)
