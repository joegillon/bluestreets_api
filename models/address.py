from utils.strlib import StrLib


class Address(object):

    def __init__(self, d):
        if 'address' not in d:
            raise ValueError('Must have "address" attribute!')

        self.__house_number = None
        self.__street_prefix = None
        self.__street_name = None
        self.__street_metaphone = None
        self.__street_type = None
        self.__street_suffix = None
        self.__street_side = None
        self.__unit = None
        self.__block = None
        self.__city = None
        self.__zipcode = None
        self.precinct_id = None

        self.__parse(d['address'])

        for attr in ['city', 'zipcode', 'precinct_id']:
            if attr in d:
                setattr(self, attr, d[attr])

    def __str__(self):
        return '%s %s' % (str(self.house_number), self.get_street())

    def get_street(self):
        s = ''
        if self.street_prefix:
            s += ' %s' % self.street_prefix
        s += ' %s' % self.street_name
        if self.street_type:
            s += ' %s' % self.street_type
        if self.street_suffix:
            s += ' %s' % self.street_suffix
        if self.unit:
            s += ' Unit %s' % self.unit
        return s.strip()

    def attrs(self):
        return list(map(lambda x: x.replace('_Address__', ''), vars(self)))

    def serialize(self):
        return {
            'house_number': self.house_number,
            'street_prefix': self.street_prefix,
            'street_name': self.street_name,
            'street_type': self.street_type,
            'street_suffix': self.street_suffix,
            'unit': self.unit,
            'city': self.city,
            'zip': self.zipcode,
            'precinct_id': self.precinct_id,
            'street_metaphone': self.street_metaphone
        }

    @property
    def house_number(self):
        return self.__house_number

    @house_number.setter
    def house_number(self, value):
        self.__house_number = value
        if value:
            self.__set_street_side()
            self.__set_block()

    @property
    def street_side(self):
        return self.__street_side

    @property
    def street_name(self):
        return self.__street_name

    @street_name.setter
    def street_name(self, value):
        self.__street_name = value.upper()
        self.__set_street_metaphone()

    @property
    def street_type(self):
        return self.__street_type

    @street_type.setter
    def street_type(self, value):
        self.__street_type = value.upper()

    @property
    def street_prefix(self):
        return self.__street_prefix

    @street_prefix.setter
    def street_prefix(self, value):
        if value in self.__directional_mappings.keys():
            value = self.__directional_mappings[value]
        self.__street_prefix = value

    @property
    def street_suffix(self):
        return self.__street_suffix

    @street_suffix.setter
    def street_suffix(self, value):
        if value in self.__directional_mappings.keys():
            value = self.__directional_mappings[value]
        self.__street_suffix = value

    @property
    def unit(self):
        return self.__unit

    @unit.setter
    def unit(self, val):
        self.__unit = StrLib.extract_numeric(val) if val else ''

    @property
    def city(self):
        return self.__city

    @city.setter
    def city(self, value, city_list=None):
        if city_list and value not in city_list:
            raise ValueError("Invalid city!")
        self.__city = value.upper() if value else ''

    @property
    def zipcode(self):
        return self.__zipcode

    @zipcode.setter
    def zipcode(self, value, zipcode_list=None):
        if zipcode_list and value not in zipcode_list:
            raise ValueError('Invalide zipcode!')
        self.__zipcode = value

    @property
    def street_metaphone(self):
        return self.__street_metaphone

    @property
    def block(self):
        return self.__block

    def __parse(self, addr_str):
        from usaddress import tag

        try:
            # Note that we replace . with space
            d = tag(addr_str.replace('.', ' ').upper())[0]
        except Exception:
            raise ValueError('Unable to parse address %s' % (addr_str,))

        if 'StreetName' not in d:
            raise ValueError('Address has no street name!')

        street_name = d['StreetName'].replace(' ', '')

        if 'AddressNumber' in d:
            self.house_number = int(StrLib.extract_numeric(d['AddressNumber']))

        # Compensate for HWY, etc.
        if 'StreetNamePreType' in d:
            street_name = '%s%s' % (d['StreetNamePreType'], street_name)

        if 'StreetNamePreDirectional' in d:
            prefix = d['StreetNamePreDirectional'].replace('.', '')
            if prefix in self.__directions:
                self.street_prefix = prefix
            else:
                street_name = '%s %s' % (prefix, street_name)

        if 'StreetNamePostType' in d:
            street_type = d['StreetNamePostType'].replace('.', '')
            if street_type not in street_abbrs and \
                    street_type not in street_abbrs.values():
                street_name = '%s%s' % (street_name, street_type)
            else:
                self.street_type = street_type

        if 'StreetNamePostDirectional' in d:
            suffix = d['StreetNamePostDirectional'].replace('.', '')
            if suffix in self.__directions:
                self.street_suffix = suffix
            else:
                street_name = '%s %s' % (street_name, suffix)

        if 'OccupancyIdentifier' in d:
            self.unit = d['OccupancyIdentifier']

        self.street_name = street_name

    def __set_street_side(self):
        self.__street_side = 'E' if int(self.house_number) % 2 == 0 else 'O'

    @staticmethod
    def get_street_metaphone(name, type=None):
        from utils.match import MatchLib

        street = name.upper().strip()
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

        if type:
            st = type
            if st in street_abbrs:
                st = street_abbrs[st]
            street += ' ' + st
        return MatchLib.get_single(street)

    def __set_street_metaphone(self):
        self.__street_metaphone = Address.get_street_metaphone(self.street_name)

    def __set_block(self):
        x = int(self.house_number / 100) * 100
        y = x + 99
        self.__block = (x, y)

    def is_on_block(self, side, low=None, high=None):
        if side != 'B' and self.street_side != side:
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
