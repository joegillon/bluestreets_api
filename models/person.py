from models.person_name import PersonName


class Person(object):

    def __init__(self, d):
        self.name = d['name']
        self.dob = d['dob'] if 'dob' in d else None
        self.gender = d['gender'] if 'gender' in d else None

    def __str__(self):
        return str(self.name)
