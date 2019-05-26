from utils.match import MatchLib


class PersonName(object):

    chars_to_remove = " '."

    def __init__(self, d):
        self.__last_name = ''
        self.__first_name = ''
        self.__middle_name = ''
        self.__name_suffix = ''
        self.__nickname = ''
        self.__alias = ''
        self.__name_metaphone = ''

        for k, v in d.items():
            if hasattr(self, k):
                setattr(self, k, v)

    def __str__(self):
        return PersonName.display_name({
            'last_name': self.last_name,
            'first_name': self.first_name,
            'middle_name': self.middle_name,
            'name_suffix': self.name_suffix
        })

    def attrs(self):
        return list(map(lambda x: x.replace('_PersonName__', ''), vars(self)))

    def serialize(self):
        return {attr: getattr(self, attr) for attr in self.attrs()}

    @property
    def last_name(self):
        return self.__last_name

    @last_name.setter
    def last_name(self, value):
        self.__last_name = self.__clean(value)
        self.name_metaphone = MatchLib.get_single(self.__last_name)

    @property
    def first_name(self):
        return self.__first_name

    @first_name.setter
    def first_name(self, value):
        self.__first_name = self.__clean(value)

    @property
    def middle_name(self):
        return self.__middle_name

    @middle_name.setter
    def middle_name(self, value):
        self.__middle_name = self.__clean(value)

    @property
    def name_suffix(self):
        return self.__name_suffix

    @name_suffix.setter
    def name_suffix(self, value):
        self.__name_suffix = self.__clean(value)

    @property
    def nickname(self):
        return self.__nickname

    @nickname.setter
    def nickname(self, value):
        self.__nickname = self.__clean(value)

    @property
    def alias(self):
        return self.__alias

    @alias.setter
    def alias(self, value):
        self.__alias = value

    @property
    def name_metaphone(self):
        return self.__name_metaphone

    @name_metaphone.setter
    def name_metaphone(self, value):
        self.__name_metaphone = value

    def __clean(self, value):
        if not value:
            return ''
        return value.strip().translate({ord(c): None for c in self.chars_to_remove}).upper()

    @staticmethod
    def display_name(d):
        s = '%s, %s' % (d['last_name'], d['first_name'])
        if d['middle_name']:
            s += ' %s' % d['middle_name']
        if d['name_suffix']:
            s += ', %s' % d['name_suffix']
        return s
