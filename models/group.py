from config.extensions import db
from models.ts_mixin import TimestampMixin


class Group(TimestampMixin, db.Model):
    __tablename__ = 'groups'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    code = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)

    def __init__(self, d=None):
        self.name = None
        self.code = None
        self.description = None
        self.created_at = None
        self.updated_at = None
        if d:
            for attr in d:
                setattr(self, attr, d[attr])

    def __str__(self):
        return '%s (%s)' % (self.name, self.code)

    def attrs(self):
        return list(filter(lambda x: x[0] != '_', vars(self)))

    def serialize(self):
        return {attr: getattr(self, attr) for attr in self.attrs()}

    @staticmethod
    def get_all(with_members=False):
        return Group.query.order_by(Group.name,).all()

    @staticmethod
    def add(d):
        sql = ("INSERT INTO groups "
               "(name, code, description) "
               "VALUES (:name,:code,:desc)")
        vals = {
            'name': d['name'],
            'code': d['code'],
            'desc': d['description']
        }
        new_id = db.session.execute(sql, vals)
        db.session.commit()
        return new_id.lastrowid
