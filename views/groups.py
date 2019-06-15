from flask import Blueprint, request, jsonify, render_template
import json
from models.modification import Modification
from dal.dao import Dao
import dal.groups_dao as grp_dao

grp = Blueprint('grp', __name__, url_prefix='/grp')


@grp.route('/groups', methods=['GET'])
def groups():
    return render_template(
        'groups/groups.html',
        title='Groups',
        groups=grp_dao.get_all(Dao(), with_members=True),
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
