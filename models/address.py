from utils.strlib import StrLib


def str_parse(s):
    import usaddress

    addr = usaddress.tag(s.replace('.', ' ').upper())[0]
    mappings = [
        ('house_number', 'AddressNumber'),
        ('pre_direction', 'StreetNamePreDirectional'),
        ('street_name', 'StreetName'),
        ('street_type', 'StreetNamePostType'),
        ('suf_direction', 'StreetNamePostDirectional'),
        ('unit', 'OccupancyIdentifier')
    ]
    result = {}
    for mapping in mappings:
        result[mapping[0]] = addr[mapping[1]] if mapping[1] in addr else ''

    return result


class Address(object):

    def __init__(self, d=None):
        self.__pre_direction = ''
        self.__house_number = ''
        self.__street_name = ''
        self.__street_type = ''
        self.__suf_direction = ''
        self.__odd_even_x = ''
        self.__unit = ''
        self.__city = ''
        self.zipcode = ''
        self.__metaphone = ''
        self.__block_x = None
        self.precinct_id = None
        if d:
            if 'address' in d:
                self.__parse(d)
            for prop in [attr.replace('_Address__', '') for attr in self.__dict__]:
                if prop in d and not prop.endswith('_x'):
                    setattr(self, prop, d[prop])

    def __str__(self):
        return '%s %s' % (str(self.house_number), self.get_street())

    def get_street(self):
        s = ''
        if self.pre_direction:
            s += ' %s' % self.pre_direction
        s += ' %s' % self.street_name
        if self.street_type:
            s += ' %s' % self.street_type
        if self.suf_direction:
            s += ' %s' % self.suf_direction
        if self.unit:
            s += ' Unit %s' % self.unit
        return s.strip()

    def serialize(self):
        return {
            'house_number': self.house_number,
            'pre_direction': self.pre_direction,
            'street_name': self.street_name,
            'street_type': self.street_type,
            'suf_direction': self.suf_direction,
            'unit': self.unit,
            'city': self.city,
            'zip': self.zipcode,
            'precinct_id': self.precinct_id,
            'street_meta': self.metaphone,
            'whole_addr': str(self)
        }

    @property
    def house_number(self):
        return self.__house_number

    @house_number.setter
    def house_number(self, value):
        self.__house_number = value
        if value:
            self.__set_odd_even()
            self.__set_block()

    @property
    def odd_even(self):
        return self.__odd_even_x

    @property
    def street_name(self):
        return self.__street_name

    @street_name.setter
    def street_name(self, value):
        self.__street_name = value.upper()
        self.__set_metaphone()

    @property
    def street_type(self):
        return self.__street_type

    @street_type.setter
    def street_type(self, value):
        self.__street_type = value.upper()
        self.__set_metaphone()

    def __set_street(self):
        self.__street = self.street_name
        if self.street_type:
            st = self.street_type
            if st in street_abbrs:
                st = street_abbrs[st]
            self.__street += ' ' + st

    @property
    def pre_direction(self):
        return self.__pre_direction

    @pre_direction.setter
    def pre_direction(self, value):
        if value in self.__directional_mappings.keys():
            value = self.__directional_mappings[value]
        self.__pre_direction = value

    @property
    def suf_direction(self):
        return self.__suf_direction

    @suf_direction.setter
    def suf_direction(self, value):
        if value in self.__directional_mappings.keys():
            value = self.__directional_mappings[value]
        self.__suf_direction = value

    @property
    def unit(self):
        return self.__unit

    @unit.setter
    def unit(self, val):
        self.__unit = StrLib.extract_numeric(val)

    @property
    def city(self):
        return self.__city

    @city.setter
    def city(self, value):
        self.__city = value.upper()

    @property
    def metaphone(self):
        return self.__metaphone

    @property
    def block(self):
        return self.__block_x

    def __parse(self, d):
        from usaddress import tag

        try:
            # Note that we replace . with space
            addr = tag(d['address'].replace('.', ' ').upper())[0]
        except Exception:
            raise Exception('Unable to parse address %s' % (d['address'],))

        if 'StreetName' not in addr:
            return

        d['street_name'] = addr['StreetName'].replace(' ', '')

        if 'AddressNumber' in addr:
            d['house_number'] = StrLib.extract_numeric(addr['AddressNumber'])
            if not d['house_number'].isnumeric():
                d['street_name'] = '%s %s' % (addr['AddressNumber'], d['street_name'])
                d['house_number'] = ''

        if 'StreetNamePreType' in addr:
            d['street_name'] = '%s%s' % (addr['StreetNamePreType'], d['street_name'])
        if 'StreetNamePreDirectional' in addr:
            d['pre_direction'] = addr['StreetNamePreDirectional'].replace('.', '')
            if d['pre_direction'] not in self.__directions:
                d['street_name'] = '%s %s' % (d['pre_direction'], d['street_name'])
                d['pre_direction'] = ''
        if 'StreetNamePostType' in addr:
            d['street_type'] = addr['StreetNamePostType'].replace('.', '')
            if d['street_type'] not in street_abbrs and \
                    d['street_type'] not in street_abbrs.values():
                d['street_name'] = '%s%s' % (d['street_name'], d['street_type'])
                d['street_type'] = ''
        if 'StreetNamePostDirectional' in addr:
            d['suf_direction'] = addr['StreetNamePostDirectional'].replace('.', '')
            if d['suf_direction'] not in self.__directions:
                d['street_name'] = '%s %s' % (d['street_name'], d['suf_direction'])
                d['suf_direction'] = None
        if 'OccupancyIdentifier' in addr:
            d['unit'] = addr['OccupancyIdentifier']

    def __set_odd_even(self):
        self.__odd_even_x = 'E' if int(self.house_number) % 2 == 0 else 'O'

    @staticmethod
    def get_street_meta(street_name, street_type=None):
        from utils.match import MatchLib

        street = street_name.upper().strip()
        if street in ordinal_streets:
            street = ordinal_streets[street]

        n = ''
        for c in list(street):
            if c.isnumeric():
                n += Address.__digit_mappings[c]
            else:
                n += c
        if n:
            street = n

        if street_type:
            st = street_type
            if st in street_abbrs:
                st = street_abbrs[st]
            street += ' ' + st
        return MatchLib.get_single(street)

    def __set_metaphone(self):
        self.__metaphone = Address.get_street_meta(self.street_name)

    def __set_block(self):
        if type(self.house_number) == int:
            n = self.house_number
        else:
            n = StrLib.extract_numeric(self.house_number)
            if not n.isnumeric():
                return '', ''
        x = int((int(n) / 100)) * 100
        y = x + 99
        self.__block_x = (x, y)

    def is_on_block(self, odd_even, low=None, high=None):
        if odd_even != 'B' and self.odd_even != odd_even:
            return False
        if not low:
            return True
        return low <= self.house_number <= high

    __directions = [
        'N', 'NE', 'NW',
        'S', 'SE', 'SW',
        'E', 'W'
    ]

    __directional_mappings = {
        'NORTH': 'N',
        'NORTHEAST': 'NE',
        'NORTHWEST': 'NW',
        'SOUTH': 'S',
        'SOUTHEAST': 'SE',
        'SOUTHWEST': 'SW',
        'EAST': 'E',
        'WEST': 'W'
    }

    __digit_mappings = {
        '0': 'ZERO',
        '1': 'ONE',
        '2': 'TWO',
        '3': 'THREE',
        '4': 'FOUR',
        '5': 'FIVE',
        '6': 'SIX',
        '7': 'SEVEN',
        '8': 'EIGHT',
        '9': 'NINE'
    }


street_abbrs = {
    'AV': 'AVENUE',
    'AVE': 'AVENUE',
    'BCH': 'BEACH',
    'BLF': 'BLUFF',
    'BLVD': 'BOULEVARD',
    'BND': 'BEND',
    'CIR': 'CIRCLE',
    'CRES': 'CRESCENT',
    'CT': 'COURT',
    'CV': 'COVE',
    'DR': 'DRIVE',
    'GLN': 'GLEN',
    'HL': 'HILL',
    'HOLW': 'HOLLOW',
    'HTS': 'HEIGHTS',
    'HWY': 'HIGHWAY',
    'LN': 'LANE',
    'LNDG': 'LANDING',
    'PKWY': 'PARKWAY',
    'PKY': 'PARKWAY',
    'PL': 'PLACE',
    'PT': 'POINT',
    'RD': 'ROAD',
    'RDG': 'RIDGE',
    'SQ': 'SQUARE',
    'ST': 'STREET',
    'TER': 'TERRACE',
    'TERR': 'TERRACE',
    'TRCE': 'TRACE',
    'TRL': 'TRAIL',
    'VW': 'VIEW',
    'WAY': 'WAY',
    'XING': 'CROSSING'
}

ordinal_streets = {
    'FIRST': '1ST', 'SECOND': '2ND', 'THIRD': '3RD',
    'FOURTH': '4TH', 'FIFTH': '5TH', 'SIXTH': '6TH',
    'SEVENTH': '7TH', 'EIGHTH': '8TH', 'NINTH': '9TH',
    'TENTH': '10TH', 'ELEVENTH': '11TH', 'TWELFTH': '12TH'
}
