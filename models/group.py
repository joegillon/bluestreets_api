from config.extensions import db
from models.ts_mixin import TimestampMixin


class Group(TimestampMixin, db.Model):
    __tablename__ = 'groups'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    code = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)

    def __str__(self):
        return '%s (%s)' % (self.name, self.code)

    def attrs(self):
        return list(filter(lambda x: x[0] != '_', vars(self)))

    def serialize(self):
        return {attr: getattr(self, attr) for attr in self.attrs()}
