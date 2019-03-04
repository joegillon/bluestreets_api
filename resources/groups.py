from flask_restful import marshal_with, reqparse, fields, Resource
from flask import Blueprint
from models.group import Group

fields = {
    'id': fields.Integer,
    'name': fields.String,
    'code': fields.String,
    'description': fields.String,
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime
}

grp_api = Blueprint('grp_api', __name__, url_prefix='/grp_api')


class Groups(Resource):

    @marshal_with(fields)
    def get(self):
        groups = Group.query.order_by(
            Group.name,
        ).all()
        return groups
