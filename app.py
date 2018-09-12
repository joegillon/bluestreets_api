from flask import Flask, request
from flask_restful import Api
from resources.contacts import Contacts, ContactsByPct, \
    ContactsByNeighborhood, con_api
from resources.precincts import Precinct, Precincts, pct_api
from resources.voters import *

app = Flask(__name__)
api = Api(app)

app.register_blueprint(con_api)
app.register_blueprint(pct_api)
app.register_blueprint(vtr_api)

api.add_resource(Contacts, '/con_api/all')
api.add_resource(ContactsByPct, '/con_api/pct/<int:pct_id>')
api.add_resource(ContactsByNeighborhood, '/con_api/blocks')

api.add_resource(VotersByPct, '/vtr_api/pct/<int:pct_id>')
api.add_resource(VotersByNeighborhood, '/vtr_api/blocks')
api.add_resource(HistoryByVoter, '/vtr_api/hx_voters')
api.add_resource(HistoryByPct, '/vtr_api/hx_pcts')

api.add_resource(Precincts, '/pct_api/all')
api.add_resource(Precinct, '/pct_api/pct/<int:pct_id>')


@app.route('/testpost', methods=['POST'])
def testpost():
    frm = request.form
    pass


if __name__ == '__main__':
    import os

    app_path = os.path.dirname(__file__)
    app.config['DB_PATH'] = os.path.join(app_path, 'data\\26161.db')
    app.run(debug=True)
