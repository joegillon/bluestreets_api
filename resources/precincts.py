from flask_restful import marshal_with, fields, Resource
from flask import Blueprint
from models.precinct import Precinct

pct_api = Blueprint('pct_api', __name__, url_prefix='/pct_api')

fields = {
    'id': fields.Integer,
    'county_code': fields.String,
    'county_name': fields.String,
    'jurisdiction_code': fields.String,
    'jurisdiction_name': fields.String,
    'ward': fields.String,
    'precinct': fields.String,
    'slots': fields.Integer,
    'state_house': fields.String,
    'state_senate': fields.String,
    'congress': fields.String,
    'county_commissioner': fields.String,
    'school_precinct': fields.String
}


class Precincts(Resource):

    @marshal_with(fields)
    def get(self):
        return Precinct.query.order_by(
            Precinct.jurisdiction_name,
            Precinct.ward,
            Precinct.precinct
        ).all()
