from flask import Blueprint, jsonify
from models.modification import Modification

mod = Blueprint('mod', __name__, url_prefix='/mod')


@mod.route('/get', methods=['GET'])
def get_mods():
    rex = Modification.get()
    mods = [rec.serialize() for rec in rex]
    return jsonify(mods)
