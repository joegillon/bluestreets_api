from config.extensions import db


class Modification(db.Model):
    __tablename__ = 'modifications'

    table_name = db.Column(db.Text, primary_key=True)
    changed_at = db.Column(db.DateTime)

    @staticmethod
    def get():
        return Modification.query.all()

    def attrs(self):
        return list(filter(lambda x: x[0] != '_', vars(self)))

    def serialize(self):
        return {attr: getattr(self, attr) for attr in self.attrs()}
