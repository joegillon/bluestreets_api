from flask_restful import marshal_with, reqparse, fields, Resource
from flask import Blueprint
from models.contact import Contact

fields = {
    'id': fields.Integer,
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
    'email': fields.String,
    'phone1': fields.String,
    'phone2': fields.String,
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
    'active': fields.Boolean,
    'comment': fields.String,
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime
}

con_api = Blueprint('con_api', __name__, url_prefix='/con_api')

parser = reqparse.RequestParser()
parser.add_argument(
    'blocks',
    dest='blocks',
    location='form',
    required=True
)


class Contacts(Resource):

    @marshal_with(fields)
    def get(self):
        contacts = Contact.query.order_by(
            Contact.last_name,
            Contact.first_name,
            Contact.middle_name
        ).all()
        return contacts


class ContactsSince(Resource):

    @marshal_with(fields)
    def get(self):
        pass
