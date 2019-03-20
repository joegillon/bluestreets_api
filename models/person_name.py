from utils.match import MatchLib


class PersonName(object):

    chars_to_remove = " '."

    def __init__(self, d=None):
        self.__last = ''
        self.__first = ''
        self.__middle = ''
        self.__suffix = ''
        self.__nickname = ''
        self.__metaphone = ''
        if d:
            self.__from_dict(d)

    def __from_dict(self, d):
        for k, v in d.items():
            setattr(self, k, v)

    def __str__(self):
        s = '%s, %s' % (self.last, self.first)
        if self.middle:
            s += ' %s' % self.middle
        if self.suffix:
            s += ', %s' % self.suffix
        return s

    def attrs(self):
        return list(map(lambda x: x.replace('_PersonName__', ''), vars(self)))

    def serialize(self):
        result = {attr: getattr(self, attr) for attr in self.attrs()}
        result['display'] = str(self)
        return result

    @property
    def last(self):
        return self.__last

    @last.setter
    def last(self, value):
        self.__last = self.__clean(value)
        self.__metaphone = MatchLib.get_single(self.__last)

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
    def metaphone(self):
        return self.__metaphone

    @property
    def nickname(self):
        return self.__nickname

    @nickname.setter
    def nickname(self, value):
        self.__nickname = value

    def __clean(self, value):
        if not value:
            return ''
        return value.strip().translate({ord(c): None for c in self.chars_to_remove}).upper()
