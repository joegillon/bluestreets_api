from dao.setup import db


class Precinct(db.Model):
    __tablename__ = 'precincts'

    id = db.Column(db.Integer, primary_key=True)
    county_code = db.Column(db.Text, nullable=False)
    county_name = db.Column(db.Text, nullable=False)
    jurisdiction_code = db.Column(db.Text, nullable=False)
    jurisdiction_name = db.Column(db.Text, nullable=False)
    ward = db.Column(db.Text, nullable=False)
    precinct = db.Column(db.Text, nullable=False)
    state_house = db.Column(db.Text, nullable=False)
    state_senate = db.Column(db.Text, nullable=False)
    congress = db.Column(db.Text, nullable=False)
    county_commissioner = db.Column(db.Text, nullable=False)
    school_precinct = db.Column(db.Text, nullable=False)

