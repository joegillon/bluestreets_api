from flask import Blueprint, request, jsonify, render_template
import json
from models.modification import Modification
from dal.dao import Dao
import dal.groups_dao as grp_dao
import dal.contact_dao as con_dao
from utils.strlib import StrLib

grp = Blueprint('grp', __name__, url_prefix='/grp')


@grp.route('/groups', methods=['GET'])
def groups():
    con_rex = con_dao.get_all(Dao())
    contacts = [{'id': rec['id'], 'name': StrLib.common_name(rec)} for rec in con_rex]

    return render_template(
        'groups/groups.html',
        title='Groups',
        groups=grp_dao.get_all(Dao(), with_members=True),
        contacts=contacts,
        modifications=Modification.get_all(serialized=True)
    )


@grp.route('/add', methods=['POST'])
def add():
    params = json.loads(request.form['params'])
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
    try:
        grp_dao.drop(Dao(), grp_id)
        return jsonify(dropped='Group dropped!')
    except Exception as ex:
        return jsonify(error=str(ex))


@grp.route('/add_member', methods=['POST'])
def add_member():
    params = json.loads(request.form['params'])
    try:
        mem_id = grp_dao.add_member(Dao(), params)
        return jsonify(mem_id=mem_id)
    except Exception as ex:
        return jsonify(error=str(ex))


@grp.route('/update_member', methods=['POST'])
def update_member():
    params = json.loads(request.form['params'])
    try:
        nrows = grp_dao.update_member(Dao(), params)
        return jsonify(nrows=nrows)
    except Exception as ex:
        return jsonify(error=str(ex))


@grp.route('/drop_member', methods=['GET'])
def drop_member():
    mem_id = json.loads(request.args['mem_id'])
    try:
        grp_dao.drop(Dao(), mem_id)
        return jsonify(dropped='Member dropped!')
    except Exception as ex:
        return jsonify(error=str(ex))
