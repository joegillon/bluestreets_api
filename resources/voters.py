from flask_restful import marshal_with, reqparse, fields, Resource
from flask import json, Blueprint
from dao.dao import Dao
import models.common as cmn
import resources.helpers as hlp

vtr_api = Blueprint('vtr_api', __name__, url_prefix='/vtr_api')

fields = {
    'last_name': fields.String,
    'first_name': fields.String,
    'middle_name': fields.String,
    'name_suffix': fields.String,
    'nickname': fields.String,
    'last_name_meta': fields.String,
    'first_name_meta': fields.String,
    'nickname_meta': fields.String,
    'name': fields.String,
    'birth_year': fields.Integer,
    'gender': fields.String,
    'house_number': fields.String,
    'pre_direction': fields.String,
    'street_name': fields.String,
    'street_type': fields.String,
    'suf_direction': fields.String,
    'unit': fields.String,
    'street_name_meta': fields.String,
    'address': fields.String,
    'city': fields.String,
    'zipcode': fields.String,
    'precinct_id': fields.Integer,
    'voter_id': fields.Integer,
    'reg_date': fields.String,
    'permanent_absentee': fields.String,
    'status': fields.String,
    'uocava': fields.String,
    'party': fields.String,
    'comment': fields.String
}

parser = reqparse.RequestParser()
parser.add_argument(
    'blocks',
    dest='blocks',
    location='form',
    required=True
)


class VotersByPct(Resource):

    @marshal_with(fields)
    def get(self, pct_id):
        dao = Dao()
        rex = cmn.get_for_precinct(dao, 'voters', pct_id)
        return [hlp.to_display(rec) for rec in rex]


class VotersByNeighborhood(Resource):

    @marshal_with(fields)
    def post(self):
        args = parser.parse_args()
        blocks = json.loads(args.blocks)
        dao = Dao(stateful=True)
        rex = []
        for block in blocks:
            rex += cmn.get_for_block(dao, 'voters', block)
        dao.close()
        return [hlp.to_display(rec) for rec in rex]
