import json
from flask import Blueprint, request, jsonify, render_template
from models.contact import Contact
from models.group import Group
from models.membership import Membership
from models.street import Street
from models.precinct import Precinct
from models.modification import Modification

con = Blueprint('con', __name__, url_prefix='/con')


@con.route('/grid', methods=['GET'])
def grid():
    if request.method == 'GET':
        # rex = Precinct.get_all()
        # pcts = [rec.serialize() for rec in rex]

        rex = Modification.get();
        mods = [rec.serialize() for rec in rex]

        rex = Contact.get_all()
        contacts = [rec.serialize() for rec in rex]

        rex = Group.get_all()
        groups = [rec.serialize() for rec in rex]

        rex = Membership.get_all()
        memberships = [rec.serialize() for rec in rex]

        # rex = Street.query.all()
        # streets = [rec.serialize() for rec in rex]

        return render_template(
            'contacts/mgt.html',
            contacts=contacts,
            groups=groups,
            members=memberships,
            # streets=streets,
            modifications=mods,
            # precincts=pcts,
            title='Contacts'
        )


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

dups = []


@con.route('/duplicates', methods=['GET', 'POST'])
def duplicates():
    import csv
    from bluestreets import app_path
    from config.extensions import db
    from models.address import Address

    global dups
    dups = []

    if request.method == 'GET':
        fname = '%s/data_mgt/duplicate_report.csv' % app_path
        with open(fname, 'r', newline='') as csvfile:
            rdr = csv.reader(csvfile)
            for row in rdr:
                ids = list(map(int, row))
                rex = Contact.query.filter(Contact.id.in_(ids)).all()
                contacts = {rec.id: rec.serialize() for rec in rex}
                dups.append(contacts)
        csvfile.close()

        if not dups:
            return jsonify(msg='No duplicates!')

        rex = Street.get_all()
        streets = [rec.serialize() for rec in rex]

        rex = Precinct.get_all()
        pcts = [rec.serialize() for rec in rex]

        return render_template(
            'contacts/dups.html',
            dups=dups,
            streets=streets,
            precincts=pcts,
            title='Duplicates'
        )

    data = json.loads(request.form['params'])
    for update in data[0]:
        addr = Address(update)
        for attr in [
                'house_number', 'pre_direction', 'street_name',
                'street_type', 'suf_direction', 'unit']:
            update[attr] = getattr(addr, attr)
        del update['address']
        update_id = update['id']
        del update['id']
        del update['pct_name']
        del update['name']
        nrex = Contact.query.filter_by(id=update_id).update(update)

    for rec_id in data[1]:
        Contact.query.filter_by(id=rec_id).delete()

    db.session.commit()

    return jsonify(msg='Whoopee!')


@con.route('/precincts', methods=['GET', 'POST'])
def precincts():
    if request.method == 'GET':
        rex = Contact.get_missing_pct()
        if not rex:
            return jsonify(msg='No contacts without precinct!')
        contacts = [rec.serialize() for rec in rex]

        rex = Precinct.get_all()
        pcts = [rec.serialize() for rec in rex]

        rex = Street.get_all()
        streets = [rec.serialize() for rec in rex]

        return render_template(
            'contacts/pcts.html',
            contacts=contacts,
            streets=streets,
            precincts=pcts,
            title='Assign Precincts'
        )


@con.route('/voter_lookup', methods=['POST'])
def voter_lookup():
    from models.voter import Voter

    contact = json.loads(request.form['params'])
    try:
        voters = Voter.fuzzy_lookup(contact)
        candidates = [voter.serialize() for voter in voters]
        return jsonify(candidates=candidates)
    except Exception as ex:
        return jsonify(error=str(ex))
