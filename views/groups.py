from flask import Blueprint, request, jsonify, render_template
import json
from models.contact import Contact
from models.group import Group
from models.membership import Membership

grp = Blueprint('grp', __name__, url_prefix='/grp')


@grp.route('/groups', methods=['GET', 'POST'])
def groups():

    if request.method == 'GET':
        conrex = Contact.query.all()
        contacts = [{
            'id': rec.id,
            'name': {
                'last': rec.last_name,
                'first': rec.first_name,
                'middle': rec.middle_name,
                'suffix': rec.name_suffix,
                'nickname': rec.nickname,
            },
            'contact_info': {
                'email': rec.email,
                'phone1': rec.phone1,
                'phone2': rec.phone2,
            },
        } for rec in conrex]

        grps = Group.query.all()

        memberships = Membership.query.all()

        return render_template(
            'groups/groups.html',
            title='Groups',
            contacts=contacts,
            groups=grps,
            members=memberships
        )


@grp.route('/add', methods=['POST'])
def add():
    params = json.loads(request.form['params'])
    del params['id']
    try:
        grp_id = grp_dao.add(Dao(), params)
        return jsonify(grp_id=grp_id)
    except Exception as ex:
        return jsonify(error=str(ex))


@grp.route('/update', methods=['POST'])
def update():
    params = json.loads(request.form['params'])
    try:
        nrows = grp_dao.update(Dao(), params)
        return jsonify(nrows=nrows)
    except Exception as ex:
        return jsonify(error=str(ex))


@grp.route('/drop', methods=['GET'])
def drop():
    grp_id = json.loads(request.args['grp_id'])
    dao = Dao(stateful=True)
    try:
        grp_dao.drop(dao, grp_id)
        return jsonify(dropped='Group dropped!')
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()
