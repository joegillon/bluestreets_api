from config.extensions import db


class Precinct(db.Model):
    __tablename__ = 'precincts'

    id = db.Column(db.Integer, primary_key=True)
    jurisdiction_name = db.Column(db.Text, nullable=False)
    ward = db.Column(db.Text, nullable=False)
    precinct = db.Column(db.Text, nullable=False)
    state_house = db.Column(db.Text, nullable=False)
    state_senate = db.Column(db.Text, nullable=False)
    congress = db.Column(db.Text, nullable=False)

    def __str__(self):
        return '%s, %s %s' % (
            self.jurisdiction_name,
            self.ward,
            self.precinct
        )

    def attrs(self):
        return list(filter(lambda x: x[0] != '_', vars(self)))

    def serialize(self):
        result = {attr: getattr(self, attr) for attr in self.attrs()}
        return result
