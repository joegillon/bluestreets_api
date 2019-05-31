from flask import Blueprint, jsonify
from models.precinct import Precinct
from models.street import Street

trf = Blueprint('trf', __name__, url_prefix='/trf')


@trf.route('/precincts', methods=['GET'])
def get_precincts():
    rex = Precinct.get_all()
    pcts = [rec.serialize() for rec in rex]
    return jsonify(pcts)


@trf.route('/streets', methods=['GET'])
def get_streets():
    rex = Street.get_all();
    streets = [rec.serialize() for rec in rex]
    return jsonify(streets)
