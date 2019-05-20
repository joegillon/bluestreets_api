from config.extensions import db
from models.ts_mixin import TimestampMixin
from models.person_name import PersonName
from utils.match import MatchLib


class Voter(TimestampMixin, db.Model):
    __tablename__ = 'voters'

    last_name = db.Column(db.Text, nullable=False)
    first_name = db.Column(db.Text, nullable=False)
    middle_name = db.Column(db.Text)
    name_suffix = db.Column(db.Text)
    name_metaphone = db.Column(db.Text, nullable=False)
    birth_year = db.Column(db.Integer)
    gender = db.Column(db.Text)
    house_number = db.Column(db.Integer)
    street_prefix = db.Column(db.Text)
    street_name = db.Column(db.Text)
    street_type = db.Column(db.Text)
    street_suffix = db.Column(db.Text)
    unit = db.Column(db.Text)
    street_metaphone = db.Column(db.Text)
    city = db.Column(db.Text)
    zipcode = db.Column(db.Text)
    precinct_id = db.Column(db.Integer)
    voter_id = db.Column(db.Integer, primary_key=True)
    reg_date = db.Column(db.Text)
    permanent_absentee = db.Column(db.Text)
    status = db.Column(db.Text)
    uocava = db.Column(db.Text)
    party = db.Column(db.Text)

    def __init__(self, d=None):
        if d:
            self.last_name = d['last_name'].upper()
            self.name_metaphone = MatchLib.get_single(self.last_name)
            self.first_name = d['first_name'].upper()

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

    # @hybrid_property
    # def person_name(self):
    #     from models.person_name import PersonName
    #
    #     return PersonName({
    #         'last': self.last,
    #         'first': self.first,
    #         'middle': self.middle,
    #         'suffix': self.suffix
    #     })
    #
    # def serialize(self):
    #     return {
    #         'id': self.id,
    #         'name': self.person_name.serialize(),
    #         'address': {
    #             'house_number': self.house_number,
    #             'pre_direction': self.pre_direction,
    #             'street_name': self.street_name,
    #             'street_type': self.street_type,
    #             'suf_direction': self.suf_direction,
    #             'unit': self.unit,
    #             'street_metaphone': self.street_metaphone,
    #             'city': self.city,
    #             'zipcode': self.zipcode
    #         },
    #         'voter_info': {
    #             'voter_id': self.voter_id,
    #             'precinct_id': self.precinct_id,
    #             'birth_year': self.birth_year,
    #             'gender': self.gender,
    #             'reg_date': self.reg_date,
    #             'permanent_absentee': self.permanent_absentee,
    #             'status': self.status,
    #             'uocava': self.uocava,
    #             'party': self.party
    #         },
    #         'created_at': self.created_at,
    #         'updated_at': self.updated_at
    #     }

    @staticmethod
    def by_fuzzy_name_and_address(pn, addr):
        return Voter.query.filter(
            (Voter.street_metaphone == addr.street_metaphone) &
            (Voter.street_name.like(addr.street_name[0] + '%')) &
            (Voter.house_number.between(addr.block[0], addr.block[1])) &
            (Voter.name_metaphone == pn.metaphone) &
            (Voter.last_name.like(pn.last[0] + '%'))
        ).all()

    @staticmethod
    def by_fuzzy_name(pn):
        return Voter.query.filter(
            (Voter.name_metaphone == pn.metaphone) &
            (Voter.last_name.like(pn.last[0] + '%')) &
            (Voter.first_name.like(pn.first[0] + '%'))
        ).all()

    @staticmethod
    def fuzzy_lookup(params):
        from models.person_name import PersonName
        from models.address import Address

        pn = PersonName(params)
        if 'address' in params and params['address'] != '':
            addr = Address(params)
            matches = Voter.by_fuzzy_name_and_address(pn, addr)
            if matches:
                return matches

        candidates = Voter.by_fuzzy_name(pn)
        candidates_by_name = {str(candidate): candidate for candidate in candidates}
        names = [str(candidate) for candidate in candidates]
        matches = MatchLib.get_best_partials(str(pn), names, 75)
        return [candidates_by_name[match] for match in matches]
