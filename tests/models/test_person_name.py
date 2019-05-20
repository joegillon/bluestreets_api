import unittest
from models.person_name import PersonName


class TestPersonName(unittest.TestCase):

    def test_init(self):
        d = {
            'last_name': 'Marx',
            'first_name': 'Julius',
            'nickname': 'Groucho',
            'name_suffix': 'JR',
            'alias': 'Capt. Spaulding, ESQ'
        }
        pn = PersonName(d)
        self.assertEqual('MARX, JULIUS, JR', str(pn))
        self.assertEqual('GROUCHO', pn.nickname)
        self.assertEqual('Capt. Spaulding, ESQ', pn.alias)
        self.assertEqual('MRKS', pn.name_metaphone)