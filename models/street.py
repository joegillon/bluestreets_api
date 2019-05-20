from config.extensions import db


class Street(db.Model):
    __tablename__ = 'streets'

    id = db.Column(db.Integer, primary_key=True)
    house_num_low = db.Column(db.Integer)
    house_num_high = db.Column(db.Integer)
    street_side = db.Column(db.Text)
    street_prefix = db.Column(db.Text)
    street_name = db.Column(db.Text)
    street_type = db.Column(db.Text)
    street_suffix = db.Column(db.Text)
    street_metaphone = db.Column(db.Text, nullable=False)
    ext_low = db.Column(db.Text)
    ext_high = db.Column(db.Text)
    city = db.Column(db.Text)
    zipcode = db.Column(db.Text)
    precinct_id = db.Column(db.ForeignKey('precincts.id'))

    def __str__(self):
        s = ''
        if self.street_prefix:
            s += ' %s' % self.street_prefix
        s += ' %s' % self.street_name
        if self.street_type:
            s += ' %s' % self.street_type
        if self.street_suffix:
            s += ' %s' % self.street_suffix
        return s.strip()

    def attrs(self):
        return list(filter(lambda x: x[0] != '_', vars(self)))

    def serialize(self):
        return {attr: getattr(self, attr) for attr in self.attrs()}
