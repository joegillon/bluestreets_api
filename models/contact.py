from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
from config.extensions import db
from models.ts_mixin import TimestampMixin


class Contact(TimestampMixin, db.Model):
    __tablename__ = 'contacts'

    id = db.Column(db.Integer, primary_key=True)
    last = db.Column(db.Text, nullable=False)
    first = db.Column(db.Text, nullable=False)
    middle = db.Column(db.Text)
    suffix = db.Column(db.Text)
    nickname = db.Column(db.Text)
    name_metaphone = db.Column(db.Text, nullable=False)
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
    street_metaphone = db.Column(db.Text)
    city = db.Column(db.Text)
    zipcode = db.Column(db.Text)
    precinct_id = db.Column(db.Integer)
    voter_id = db.Column(db.Integer)
    reg_date = db.Column(db.Text)
    active = db.Column(db.Boolean)
    comment = db.Column(db.Text)

    def __str__(self):
        return str(self.person_name)

    @hybrid_property
    def person_name(self):
        from models.person_name import PersonName

        return PersonName({
            'last': self.last,
            'first': self.first,
            'middle': self.middle,
            'suffix': self.suffix
        })

    def serialize(self):
        return {
            'id': self.id,
            'name': self.person_name.serialize(),
            # 'name': {
            #     'last': self.last,
            #     'first': self.first,
            #     'middle': self.middle,
            #     'suffix': self.suffix,
            #     'nickname': self.nickname,
            #     'name_metaphone': self.name_metaphone,
            #     'display': str(self.person_name)
            # },
            'address': {
                'house_number': self.house_number,
                'pre_direction': self.pre_direction,
                'street_name': self.street_name,
                'street_type': self.street_type,
                'suf_direction': self.suf_direction,
                'unit': self.unit,
                'street_metaphone': self.street_metaphone,
                'city': self.city,
                'zipcode': self.zipcode
            },
            'contact_info': {
                'email': self.email,
                'phone1': self.phone1,
                'phone2': self.phone2,
            },
            'voter_info': {
                'voter_id': self.voter_id,
                'precinct_id': self.precinct_id,
                'birth_year': self.birth_year,
                'gender': self.gender,
                'reg_date': self.reg_date
            },
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }