import unittest
import models.voter as vtr
from dao.dao import Dao


class TestVoter(unittest.TestCase):

    def setUp(self):
        dbfile = 'c:/bench/bluestreets_api/data/26161.db'
        self.dao = Dao(db_file=dbfile, stateful=True)
        self.voter_ids = get_voters(self.dao)

    def tearDown(self):
        self.dao.close()

    def test_next_hundred(self):
        ids = [x for x in range(0, 111)]
        idx = 0
        batch, idx = vtr.next_hundred(ids, idx)
        self.assertEqual(100, len(batch))
        self.assertEqual(100, idx)
        self.assertEqual([x for x in range(0, 100)], batch)
        batch, idx = vtr.next_hundred(ids, idx)
        self.assertEqual(11, len(batch))
        self.assertEqual(111, idx)
        self.assertEqual([x for x in range(100, 111)], batch)

    def test_get_hx(self):
        dbfile = 'c:/bench/bluestreets_api/data/26161.db'
        dao = Dao(db_file=dbfile, stateful=True)
        ids = sorted(get_voters(dao))
        self.assertEqual(34085, len(ids))
        hx = vtr.get_hx(dao, ids)
        dao.close()
        self.assertEqual(305518, len(hx))

    def test_get_voters_for_precinct(self):


if __name__ == '__main__':
    unittest.main()
