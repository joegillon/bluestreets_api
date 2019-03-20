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

        rex = Street.query.filter_by(county_code=81).all()
        streets = [rec.serialize() for rec in rex]

        rex = Jurisdiction.query.all()
        jurisdictions = {rec.code: rec.name for rec in rex}

        return render_template(
            'contacts/grid.html',
            contacts=contacts,
            groups=groups,
            members=memberships,
            streets=streets,
            jurisdictions=jurisdictions,
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
