from flask_restful import marshal_with, fields, Resource
from flask import Blueprint
from models.membership import Membership

fields = {
    'id': fields.Integer,
    'group_id': fields.Integer,
    'contact_id': fields.Integer,
    'role': fields.String,
    'comment': fields.String,
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime
}

mem_api = Blueprint('mem_api', __name__, url_prefix='/mem_api')


class Memberships(Resource):

    @marshal_with(fields)
    def get(self):
        memberships = Membership.query.all()
        return memberships
