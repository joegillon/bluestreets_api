import unittest
from models.person_name import PersonName


class TestPersonName(unittest.TestCase):

    def test_init(self):
        d = {
            'last': 'MARX', 'first': 'JULIUS', 'nickname': 'GROUCHO', 'suffix': 'JR'
        }
        pn = PersonName(d)
        self.assertEqual('MARX, JULIUS, JR', str(pn))
