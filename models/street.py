from config.extensions import db


class Street(db.Model):
    __tablename__ = 'streets'

    id = db.Column(db.Integer, primary_key=True)
    street_metaphone = db.Column(db.Text, nullable=False)
    block_low = db.Column(db.Integer)
    block_high = db.Column(db.Integer)
    house_num_low = db.Column(db.Integer)
    house_num_high = db.Column(db.Integer)
    odd_even = db.Column(db.Text)
    pre_direction = db.Column(db.Text)
    street_name = db.Column(db.Text)
    street_type = db.Column(db.Text)
    suf_direction = db.Column(db.Text)
    ext_low = db.Column(db.Text)
    ext_high = db.Column(db.Text)
    zipcode = db.Column(db.Text)
    county_code = db.Column(db.Text)
    jurisdiction_code = db.Column(db.Text)
    ward = db.Column(db.Text)
    precinct = db.Column(db.Text)
    village_code = db.Column(db.Text)
    school_code = db.Column(db.Text)
    state_house = db.Column(db.Text)
    state_senate = db.Column(db.Text)
    congress = db.Column(db.Text)
    county_commissioner = db.Column(db.Text)
    village_precinct = db.Column(db.Text)
    school_precinct = db.Column(db.Text)

    def __str__(self):
        s = ''
        if self.pre_direction:
            s += ' %s' % self.pre_direction
        s += ' %s' % self.street_name
        if self.street_type:
            s += ' %s' % self.street_type
        if self.suf_direction:
            s += ' %s' % self.suf_direction
        return s.strip()

    def attrs(self):
        return list(filter(lambda x: x[0] != '_', vars(self)))

    def serialize(self):
        result = {attr: getattr(self, attr) for attr in self.attrs()}
        result['display'] = str(self)
        return result
