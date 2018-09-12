from flask_restful import marshal_with, reqparse, fields, Resource
from flask import json, Blueprint
from dao.dao import Dao
import models.common as cmn
import models.voter as vtr

vtr_api = Blueprint('vtr_api', __name__, url_prefix='/vtr_api')

vtr_flds = {
    'last_name': fields.String,
    'first_name': fields.String,
    'middle_name': fields.String,
    'name_suffix': fields.String,
    'last_name_meta': fields.String,
    'first_name_meta': fields.String,
    'name': fields.String,
    'birth_year': fields.Integer,
    'gender': fields.String,
    'house_number': fields.Integer,
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

hx_flds = {
    'voter_id': fields.Integer,
    'elections': fields.String
}

parser = reqparse.RequestParser()
parser.add_argument(
    'blocks',
    dest='blocks',
    location='form',
    required=True
)

hx_vtr_parser = reqparse.RequestParser()
hx_vtr_parser.add_argument(
    'voter_ids',
    dest='voter_ids',
    location='form',
    required=True
)

hx_pct_parser = reqparse.RequestParser()
hx_pct_parser.add_argument(
    'pct_ids',
    dest='pct_ids',
    location='form',
    required=True
)


class VotersByPct(Resource):

    @marshal_with(vtr_flds)
    def get(self, pct_id):
        dao = Dao()
        return cmn.get_for_precinct(dao, 'voters', pct_id)


class VotersByNeighborhood(Resource):

    @marshal_with(vtr_flds)
    def post(self):
        args = parser.parse_args()
        blocks = json.loads(args.blocks)
        dao = Dao(stateful=True)
        rex = []
        for block in blocks:
            rex += cmn.get_for_block(dao, 'voters', block)
        dao.close()
        return rex


class HistoryByVoter(Resource):

    @staticmethod
    def post():
        args = hx_vtr_parser.parse_args()
        voter_ids = json.loads(args.voter_ids)
        dao = Dao(stateful=True)
        hx = get_hx(dao, voter_ids)
        dao.close()
        return hx


class HistoryByPct(Resource):

    @staticmethod
    def post():
        args = hx_pct_parser.parse_args()
        pct_ids = json.loads(args.pct_ids)
        dao = Dao(stateful=True)
        voter_ids = []
        for pct_id in pct_ids:
            voter_ids += vtr.get_voters_for_precinct(dao, pct_id)
        hx = get_hx(dao, voter_ids)
        dao.close()
        return hx


def get_hx(dao, voter_ids):
    data = vtr.get_hx(dao, voter_ids)
    hx = {}
    for rec in data:
        if rec['voter_id'] not in hx:
            hx[rec['voter_id']] = []
        ec = rec['election_code']
        if rec['ballot']:
            ec += rec['ballot']
        hx[rec['voter_id']].append(ec)
    for k in hx:
        hx[k] = ','.join(hx[k])
    return hx
