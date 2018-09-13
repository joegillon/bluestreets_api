import unittest
from resources.voters import get_hx
from dao.dao import Dao
from tests.models.test_voter import get_voters


class TestVoters(unittest.TestCase):

    def setUp(self):
        dbfile = 'c:/bench/bluestreets_api/data/26161.db'
        self.dao = Dao(db_file=dbfile, stateful=True)
        self.voter_ids = get_voters(self.dao)

    def tearDown(self):
        self.dao.close()

    def test_get_hx(self):
        ids = [106327,470457,108605951]
        hx = get_hx(self.dao, ids)
        self.assertEqual(len(ids), len(hx))
        ec = hx[106327].split(',')
        self.assertEqual(9, len(ec))
        self.assertEqual('D', ec[8][-1])


if __name__ == '__main__':
    unittest.main()
