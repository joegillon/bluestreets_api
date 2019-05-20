from config.extensions import db
from models.ts_mixin import TimestampMixin
from models.person_name import PersonName


class Contact(TimestampMixin, db.Model):
    __tablename__ = 'contacts'

    id = db.Column(db.Integer, primary_key=True)
    last_name = db.Column(db.Text, nullable=False)
    first_name = db.Column(db.Text, nullable=False)
    middle_name = db.Column(db.Text)
    name_suffix = db.Column(db.Text)
    nickname = db.Column(db.Text)
    alias = db.Column(db.Text)
    name_metaphone = db.Column(db.Text, nullable=False)
    dob = db.Column(db.Integer)
    gender = db.Column(db.Text)
    email = db.Column(db.Text)
    phone1 = db.Column(db.Text)
    phone2 = db.Column(db.Text)
    email_metaphone = db.Column(db.Text)
    house_number = db.Column(db.Integer)
    street_prefix = db.Column(db.Text)
    street_name = db.Column(db.Text)
    street_type = db.Column(db.Text)
    street_suffix = db.Column(db.Text)
    street_metaphone = db.Column(db.Text)
    unit = db.Column(db.Text)
    city = db.Column(db.Text)
    zipcode = db.Column(db.Text)
    precinct_id = db.Column(db.Integer)
    voter_id = db.Column(db.Integer)
    voter_reg_date = db.Column(db.Text)
    active = db.Column(db.Boolean)
    comment = db.Column(db.Text)

    def __str__(self):
        return PersonName.display_name({
            'last': self.last_name,
            'first': self.first_name,
            'middle': self.middle_name,
            'suffix': self.name_suffix
        })

    def attrs(self):
        return list(filter(lambda x: x[0] != '_', vars(self)))

    def serialize(self):
        return {attr: getattr(self, attr) for attr in self.attrs()}

    # def serialize(self):
    #     return {
    #         'id': self.id,
    #         'name': {
    #             'last': self.last_name,
    #             'first': self.first_name,
    #             'middle': self.middle,
    #             'suffix': self.suffix,
    #             'nickname': self.nickname,
    #             'alias': self.alias,
    #             'metaphone': self.name_metaphone
    #         },
    #         'address': {
    #             'house_number': self.house_number,
    #             'street_prefix': self.street_prefix,
    #             'street_name': self.street_name,
    #             'street_type': self.street_type,
    #             'street_suffix': self.street_suffix,
    #             'street_metaphone': self.street_metaphone,
    #             'unit': self.unit,
    #             'city': self.city,
    #             'zipcode': self.zipcode
    #         },
    #         'contact_info': {
    #             'email': self.email,
    #             'phone1': self.phone1,
    #             'phone2': self.phone2
    #         },
    #         'voter_info': {
    #             'voter_id': self.voter_id,
    #             'precinct_id': self.precinct_id,
    #             'dob': self.dob,
    #             'gender': self.gender,
    #             'reg_date': self.voter_reg_date
    #         },
    #         'record_info': {
    #             'created_at': self.created_at,
    #             'updated_at': self.updated_at
    #         }
    #     }

    @staticmethod
    def get_all():
        return Contact.query \
            .order_by(
                Contact.last_name, Contact.first_name, Contact.middle_name
            ) \
            .all()

    @staticmethod
    def get_missing_pct():
        return  Contact.query \
            .filter((Contact.precinct_id.is_(None))) \
            .order_by(
                Contact.last_name, Contact.first_name, Contact.middle_name
            ) \
            .all()
