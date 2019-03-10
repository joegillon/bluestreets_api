from flask_restful import Resource, reqparse
from flask import Blueprint, jsonify
from flask_praetorian import auth_required, roles_accepted
from config.extensions import guard, blacklist
from models.user import User

usr_api = Blueprint('usr_api', __name__, url_prefix='/usr_api')

parser = reqparse.RequestParser()
parser.add_argument(
    'username',
    help='Username is required!',
    required=True
)

parser.add_argument(
    'password',
    help='Password is required!',
    required=True
)

parser.add_argument('rolenames')


class UserRegistration(Resource):

    @auth_required
    @roles_accepted('admin')
    def post(self):
        data = parser.parse_args()
        username = data['username']
        password = data['password']
        rolenames = data['rolenames']

        if User.lookup(username):
            return {
                'message': 'User {} already exists'.format(username)
            }

        new_user = User()
        new_user.username = username
        new_user.password = guard.encrypt_password(password)
        new_user.rolenames = rolenames
        try:
            new_user.save()
            return {
                'message': 'User {} created'.format(username)
            }
        except Exception as ex:
            return {'message': 'Error: {}'.format(str(ex))}


class Login(Resource):
    def post(self):
        data = parser.parse_args()
        username = data['username']
        password = data['password']

        user = guard.authenticate(username, password)
        ret = {'access_token': guard.encode_jwt_token(user)}
        return jsonify(ret, 200)


class Refresh(Resource):

    @auth_required
    def get(self):
        old_token = guard.read_token_from_header()
        new_token = guard.refresh_jwt_token(old_token)
        ret = {'access_token': new_token}
        return jsonify(ret, 200)


class Blacklist(Resource):

    def post(self):
        token = guard.read_token_from_header()
        data = guard.extract_jwt_token(token)
        blacklist.add(data['jti'])
        return jsonify(message='token blacklisted')


class ChangePassword(Resource):

    @auth_required
    def post(self):
        pass


class ChangeRoles(Resource):

    @auth_required
    @roles_accepted('admin')
    def post(self):
        pass
