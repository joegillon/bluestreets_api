import unittest
from resources.voters import get_hx
from dao.dao import Dao


class TestVoters(unittest.TestCase):

    def setUp(self):
        dbfile = 'c:/bench/bluestreets_api/data/26161.db'
        self.dao = Dao(db_file=dbfile, stateful=True)
        self.voter_ids = get_voters(self.dao)

    def tearDown(self):
        self.dao.close()

    def test_get_hx(self):
        ids = self.voter_ids
        ids = [106327,470457,108605951]
        hx = get_hx(self.dao, ids)
        self.assertEqual(len(ids), len(hx))
        self.assertEqual(9, len(hx[106327]))
        self.assertEqual('D', hx[106327][8][-1])


def get_voters(dao):
    sql = ("SELECT DISTINCT voter_id FROM voter_history "
          "WHERE election_code='31000050' AND jurisdiction_code='03000'")
    rex = dao.execute(sql)
    return [rec['voter_id'] for rec in rex]


if __name__ == '__main__':
    unittest.main()
