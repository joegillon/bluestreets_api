from utils.match import MatchLib


class PersonName(object):

    chars_to_remove = " '."

    def __init__(self, d):
        self.__last = ''
        self.__first = ''
        self.__middle = ''
        self.__suffix = ''
        self.__nickname = ''
        self.__alias = ''
        self.__metaphone = ''

        for k, v in d.items():
            setattr(self, k, v)

    def __str__(self):
        return PersonName.display_name({
            'last': self.last,
            'first': self.first,
            'middle': self.middle,
            'suffix': self.suffix
        })

    def attrs(self):
        return list(map(lambda x: x.replace('_PersonName__', ''), vars(self)))

    def serialize(self):
        return {attr: getattr(self, attr) for attr in self.attrs()}

    @property
    def last(self):
        return self.__last

    @last.setter
    def last(self, value):
        self.__last = self.__clean(value)
        self.metaphone = MatchLib.get_single(self.__last)

    @property
    def first(self):
        return self.__first

    @first.setter
    def first(self, value):
        self.__first = self.__clean(value)

    @property
    def middle(self):
        return self.__middle

    @middle.setter
    def middle(self, value):
        self.__middle = self.__clean(value)

    @property
    def suffix(self):
        return self.__suffix

    @suffix.setter
    def suffix(self, value):
        self.__suffix = self.__clean(value)

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
    def metaphone(self):
        return self.__metaphone

    @metaphone.setter
    def metaphone(self, value):
        self.__metaphone = value

    def __clean(self, value):
        if not value:
            return ''
        return value.strip().translate({ord(c): None for c in self.chars_to_remove}).upper()

    @staticmethod
    def display_name(d):
        s = '%s, %s' % (d['last'], d['first'])
        if d['middle']:
            s += ' %s' % d['middle']
        if d['suffix']:
            s += ', %s' % d['suffix']
        return s
