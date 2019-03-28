import json
from flask import Blueprint, request, jsonify, render_template
from models.contact import Contact
from models.group import Group
from models.membership import Membership
from models.street import Street
from models.jurisdiction import Jurisdiction

con = Blueprint('con', __name__, url_prefix='/con')


@con.route('/grid', methods=['GET', 'POST'])
def grid():
    if request.method == 'GET':
        rex = Contact.query.order_by(
            Contact.last,
            Contact.first,
            Contact.middle
        ).all()
        contacts = [rec.serialize() for rec in rex]

        rex = Group.query.order_by(Group.name,).all()
        groups = [rec.serialize() for rec in rex]

        rex = Membership.query.all()
        memberships = [rec.serialize() for rec in rex]

        rex = Jurisdiction.query.all()
        jurisdictions = {rec.code: rec.name for rec in rex}

        rex = Street.query.filter_by(county_code=81).all()
        streets = [rec.serialize() for rec in rex]
        for street in streets:
            street['pct_name'] = '%s %s %s' % (
                jurisdictions[street['jurisdiction_code']],
                street['ward'],
                street['precinct']
            )

        return render_template(
            'contacts/grid.html',
            contacts=contacts,
            groups=groups,
            members=memberships,
            streets=streets,
            title='Contacts'
        )

    params = json.loads(request.form['params'])
    # if params['id'] == -1:
    #     contact_id = con_dao.add(Dao(), params)
    # else:
    #     con_dao.update(Dao(), params)
    #     contact_id = params['id']
    #
    # return jsonify({'contact_id': contact_id})


@con.route('/drop', methods=['GET'])
def drop():
    contact_id = json.loads(request.args['contact_id'])
    dao = Dao(stateful=True)
    success = con_dao.drop(dao, contact_id)
    dao.close()
    if not success:
        msg = 'Contact not deleted. Please report.'
        return jsonify(error=msg)
    return jsonify(dropped='Contact dropped!')


@con.route('/import', methods=['GET', 'POST'])
def csv_import():
    from config.extensions import db

    if request.method == 'GET':
        return render_template(
            'contacts/csv_import.html',
            title='Contact Import'
        )

    data = json.loads(request.form['params'])
    rex = [Contact(rename_fields(rec)) for rec in data]
    for rec in rex:
        db.session.add(rec)
    try:
        db.session.commit()
        return jsonify(msg='Successful!')
    except Exception as ex:
        db.session.rollback()
        return jsonify(error=str(ex))


def rename_fields(d):
    d['last'] = d.pop('last_name')
    d['first'] = d.pop('first_name')
    if 'middle_name' in d:
        d['middle'] = d.pop('middle_name')
    if 'name_suffix' in d:
        d['suffix'] = d.pop('name_suffix')
    return d


@con.route('/duplicates', methods=['GET', 'POST'])
def duplicates():
    import csv
    from bluestreets import app_path

    if request.method == 'GET':
        dups = []
        fname = '%s/data_mgt/duplicate_report.csv' % app_path
        with open(fname, 'r', newline='') as csvfile:
            rdr = csv.reader(csvfile)
            for row in rdr:
                ids = list(map(int, row))
                rex = Contact.query.filter(Contact.id.in_(ids)).all()
                contacts = [serialize_dup(rec) for rec in rex]
                dup = {ids[0]: contacts}
                dups.append(dup)
        csvfile.close()

        if not dups:
            return jsonify(msg='No duplicates!')

        return render_template(
            'contacts/dups.html',
            dups=dups,
            title='Duplicates'
        )


def serialize_dup(dup):
    return {
        'id': dup.id,
        'name': get_name(dup),
        'address': get_address(dup),
        'city': dup.city,
        'zipcode': dup.zipcode,
        'email': dup.email,
        'phone1': dup.phone1,
        'phone2': dup.phone2,
        'voter_id': dup.voter_id,
        'precinct_id': dup.precinct_id,
        'birth_year': dup.birth_year,
        'gender': dup.gender,
        'reg_date': dup.reg_date
    }


def get_name(dup):
    s = dup.last + ', ' + dup.first
    if dup.middle:
        s += ' ' + dup.middle
    if dup.suffix:
        s += ', ' + dup.suffix
    return s


def get_address(dup):
    if not dup.street_name:
        return ''
    s = str(dup.house_number)
    if dup.pre_direction:
        s += ' ' + dup.pre_direction
    s += ' ' + dup.street_name
    if dup.street_type:
        s += ' ' + dup.street_type
    if dup.suf_direction:
        s += ' ' + dup.suf_direction
    if dup.unit:
        s += ' Unit ' + dup.unit
    return s
