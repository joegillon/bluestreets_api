from flask import Blueprint, request, jsonify, render_template
import json

mem = Blueprint('mem', __name__, url_prefix='/mem')


@mem.route('/add', methods=['POST'])
def add():
    params = json.loads(request.form['params'])
    try:
        mem_id = mem_dao.add(Dao(), params)
        return jsonify(mem_id=mem_id)
    except Exception as ex:
        return jsonify(error=str(ex))


@mem.route('/update', methods=['POST'])
def update():
    params = json.loads(request.form['params'])
    try:
        nrows = mem_dao.update(Dao(), params)
        return jsonify(nrows=nrows)
    except Exception as ex:
        return jsonify(error=str(ex))


@mem.route('/drop', methods=['GET'])
def drop():
    mem_id = json.loads(request.args['mem_id'])
    try:
        mem_dao.drop(Dao(), mem_id)
        return jsonify(dropped='Member dropped!')
    except Exception as ex:
        return jsonify(error=str(ex))

