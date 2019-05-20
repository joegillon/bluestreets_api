import unittest
from models.address import Address, str_parse


class TestAddress(unittest.TestCase):

    def test_init(self):
        s = '711 North Main Street SW #3'
        addr = str_parse(s)
        pass