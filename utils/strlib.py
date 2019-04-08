class StrLib(object):

    @staticmethod
    def extract_numeric(s):
        if type(s) is int:
            return s
        return ''.join([x for x in s if x.isnumeric()])

    @staticmethod
    def remove_leading_zeros(s):
        if s and s.isnumeric():
            return str(int(s))
        return s

    @staticmethod
    def is_even_num(num):
        return (int(num) % 2) == 0
