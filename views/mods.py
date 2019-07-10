from flask import Blueprint, jsonify
from dal.dao import Dao
import dal.mods_dao as mods_dao

mod = Blueprint('mod', __name__, url_prefix='/mod')


@mod.route('/get', methods=['GET'])
def get_mods():
    mods = mods_dao.get_all(Dao())
    # mods = [rec.serialize() for rec in rex]
    return jsonify(mods)
