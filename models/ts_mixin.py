from datetime import datetime
from config.extensions import db


class TimestampMixin(object):
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
